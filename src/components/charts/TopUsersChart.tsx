import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

interface TopUsersChartProps {
    anomalies: Array<{
        user_name: string;
        anomaly_score: number;
    }>;
}

const TopUsersChart = ({ anomalies }: TopUsersChartProps) => {
    // Group by user and count anomalies
    const userCounts = anomalies.reduce((acc: any, anomaly) => {
        if (!acc[anomaly.user_name]) {
            acc[anomaly.user_name] = { user: anomaly.user_name, count: 0, totalScore: 0 };
        }
        acc[anomaly.user_name].count++;
        acc[anomaly.user_name].totalScore += anomaly.anomaly_score;
        return acc;
    }, {});

    const chartData = Object.values(userCounts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10) // Top 10 users
        .map((item: any) => ({
            user: item.user.split('/')[1] || item.user, // Extract username from DTAA/USERNAME
            count: item.count,
            avgScore: parseFloat((item.totalScore / item.count * 100).toFixed(1))
        }));

    // Gradient colors from red to orange
    const getBarColor = (index: number, total: number) => {
        const intensity = 1 - (index / total) * 0.7; // 100% to 30%
        return `hsl(var(--destructive) / ${intensity})`;
    };

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Top Suspicious Users
                    </CardTitle>
                    <CardDescription>No data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Run anomaly detection to see top users
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="glass hover-lift">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Top Suspicious Users
                    </CardTitle>
                    <CardDescription>Users with the most anomalies detected</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} layout="vertical">
                            <defs>
                                {chartData.map((entry, index) => (
                                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={getBarColor(index, chartData.length)} stopOpacity={0.8} />
                                        <stop offset="100%" stopColor={getBarColor(index, chartData.length)} stopOpacity={1} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                type="number"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                stroke="hsl(var(--border))"
                            />
                            <YAxis
                                dataKey="user"
                                type="category"
                                width={100}
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                stroke="hsl(var(--border))"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="count"
                                name="Anomalies"
                                radius={[0, 8, 8, 0]}
                                animationDuration={1000}
                                animationBegin={200}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#barGradient${index})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TopUsersChart;
