import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface AnomalyChartProps {
    anomalies: Array<{
        date: string;
        anomaly_score: number;
    }>;
}

const AnomalyChart = ({ anomalies }: AnomalyChartProps) => {
    // Group anomalies by date
    const groupedData = anomalies.reduce((acc: any, anomaly) => {
        const date = new Date(anomaly.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { date, count: 0, avgScore: 0, totalScore: 0 };
        }
        acc[date].count++;
        acc[date].totalScore += anomaly.anomaly_score;
        acc[date].avgScore = acc[date].totalScore / acc[date].count;
        return acc;
    }, {});

    const chartData = Object.values(groupedData)
        .slice(-30) // Last 30 days
        .map((item: any) => ({
            date: item.date,
            anomalies: item.count,
            avgScore: parseFloat((item.avgScore * 100).toFixed(1))
        }));

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Anomaly Trends
                    </CardTitle>
                    <CardDescription>No data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Run anomaly detection to see trends
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <Card className="glass hover-lift">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Anomaly Trends
                    </CardTitle>
                    <CardDescription>Daily anomaly detection over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                stroke="hsl(var(--border))"
                            />
                            <YAxis
                                yAxisId="left"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                stroke="hsl(var(--border))"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
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
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="anomalies"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={3}
                                fill="url(#colorAnomalies)"
                                name="Anomalies Count"
                                animationDuration={1000}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avgScore"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                name="Avg Score %"
                                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                activeDot={{ r: 6 }}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AnomalyChart;
