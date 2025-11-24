import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface RiskScoreCardProps {
    anomalies: Array<{
        user_name: string;
        anomaly_score: number;
    }>;
}

const RiskScoreCard = ({ anomalies }: RiskScoreCardProps) => {
    // Calculate risk scores per user
    const userRisks = anomalies.reduce((acc: any, anomaly) => {
        const user = anomaly.user_name;
        if (!acc[user]) {
            acc[user] = {
                user,
                scores: [],
                count: 0
            };
        }
        acc[user].scores.push(anomaly.anomaly_score);
        acc[user].count++;
        return acc;
    }, {});

    // Calculate final risk scores
    const riskScores = Object.values(userRisks).map((userData: any) => {
        const avgScore = userData.scores.reduce((a: number, b: number) => a + b, 0) / userData.scores.length;
        const maxScore = Math.max(...userData.scores);
        const frequency = Math.min(userData.count / 100, 1);

        // Weighted risk score
        const riskScore = (avgScore * 0.4 + maxScore * 0.4 + frequency * 0.2) * 100;

        return {
            user: userData.user.split('/')[1] || userData.user,
            fullUser: userData.user,
            riskScore,
            count: userData.count
        };
    }).sort((a, b) => b.riskScore - a.riskScore).slice(0, 10);

    const getRiskLevel = (score: number) => {
        if (score >= 70) return { label: 'Critical', color: 'destructive', gradient: 'from-red-500 to-orange-500' };
        if (score >= 50) return { label: 'High', color: 'orange', gradient: 'from-orange-500 to-yellow-500' };
        if (score >= 30) return { label: 'Medium', color: 'yellow', gradient: 'from-yellow-500 to-green-500' };
        return { label: 'Low', color: 'green', gradient: 'from-green-500 to-cyan-500' };
    };

    if (riskScores.length === 0) {
        return (
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        User Risk Scores
                    </CardTitle>
                    <CardDescription>No data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Run anomaly detection to see risk scores
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    User Risk Scores
                </CardTitle>
                <CardDescription>Top 10 users ranked by risk level</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {riskScores.map((user, index) => {
                        const risk = getRiskLevel(user.riskScore);
                        return (
                            <motion.div
                                key={user.fullUser}
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-bold"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <div>
                                            <div className="font-medium">{user.user}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {user.count} anomalies detected
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={risk.color === 'destructive' ? 'destructive' : 'secondary'}
                                            className={risk.color === 'destructive' ? 'animate-pulse-glow' : ''}
                                        >
                                            {risk.label}
                                        </Badge>
                                        <span className="text-sm font-bold w-12 text-right gradient-text">
                                            {user.riskScore.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${risk.gradient} rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${user.riskScore}%` }}
                                        transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Summary Stats */}
                <motion.div
                    className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="text-center glass-strong rounded-lg p-3">
                        <div className="text-2xl font-bold text-destructive">
                            {riskScores.filter(u => u.riskScore >= 70).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Critical Risk</div>
                    </div>
                    <div className="text-center glass-strong rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-500">
                            {riskScores.filter(u => u.riskScore >= 50 && u.riskScore < 70).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">High Risk</div>
                    </div>
                    <div className="text-center glass-strong rounded-lg p-3">
                        <div className="text-2xl font-bold text-yellow-500">
                            {riskScores.filter(u => u.riskScore >= 30 && u.riskScore < 50).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Medium Risk</div>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default RiskScoreCard;

