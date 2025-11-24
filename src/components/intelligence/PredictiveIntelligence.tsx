import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";

interface Prediction {
    id: string;
    type: "breach" | "insider_threat" | "data_exfiltration" | "unauthorized_access";
    title: string;
    description: string;
    probability: number;
    timeframe: string;
    severity: "critical" | "high" | "medium" | "low";
    indicators: string[];
    recommendations: string[];
}

const PredictiveIntelligence = () => {
    const [predictions] = useState<Prediction[]>([
        {
            id: "1",
            type: "insider_threat",
            title: "Potential Insider Threat from john.doe",
            description: "ML model predicts high likelihood of malicious insider activity based on behavioral patterns",
            probability: 87,
            timeframe: "Next 48 hours",
            severity: "critical",
            indicators: [
                "Unusual login times (3 AM - 5 AM)",
                "Accessing sensitive files outside normal scope",
                "VPN usage from unknown locations",
                "Large data transfers detected",
                "Pattern matches known insider threat cases"
            ],
            recommendations: [
                "Immediately review user access permissions",
                "Enable enhanced monitoring for this user",
                "Conduct security interview",
                "Restrict access to critical systems",
                "Notify security team for investigation"
            ]
        },
        {
            id: "2",
            type: "data_exfiltration",
            title: "Data Exfiltration Risk Detected",
            description: "Abnormal data transfer patterns suggest potential data theft attempt",
            probability: 72,
            timeframe: "Next 24 hours",
            severity: "high",
            indicators: [
                "Unusual outbound traffic volume (2.3 GB)",
                "Access to multiple sensitive databases",
                "File compression activities detected",
                "External storage device usage",
                "After-hours activity spike"
            ],
            recommendations: [
                "Block external data transfers",
                "Review DLP policies",
                "Audit recent file access logs",
                "Implement stricter egress filtering",
                "Alert data protection officer"
            ]
        },
        {
            id: "3",
            type: "unauthorized_access",
            title: "Privilege Escalation Attempt Predicted",
            description: "User behavior suggests potential attempt to gain unauthorized privileges",
            probability: 65,
            timeframe: "Next 72 hours",
            severity: "high",
            indicators: [
                "Multiple failed sudo attempts",
                "Accessing admin documentation",
                "Probing network services",
                "Unusual command-line activity",
                "Attempting to access restricted areas"
            ],
            recommendations: [
                "Review and restrict sudo access",
                "Enable command auditing",
                "Monitor privilege escalation attempts",
                "Conduct security awareness training",
                "Implement least privilege principle"
            ]
        },
        {
            id: "4",
            type: "breach",
            title: "Potential Security Breach Window",
            description: "System vulnerability combined with user behavior creates breach opportunity",
            probability: 58,
            timeframe: "Next week",
            severity: "medium",
            indicators: [
                "Unpatched critical vulnerability (CVE-2024-1234)",
                "Increased scanning activity",
                "Suspicious network traffic patterns",
                "Weak authentication on critical systems",
                "Historical attack pattern match"
            ],
            recommendations: [
                "Apply security patches immediately",
                "Strengthen authentication mechanisms",
                "Increase network monitoring",
                "Conduct penetration testing",
                "Review incident response plan"
            ]
        }
    ]);

    // Threat trend data
    const trendData = [
        { date: "Mon", predicted: 45, actual: 42 },
        { date: "Tue", predicted: 52, actual: 48 },
        { date: "Wed", predicted: 48, actual: 51 },
        { date: "Thu", predicted: 65, actual: 62 },
        { date: "Fri", predicted: 72, actual: 68 },
        { date: "Sat", predicted: 38, actual: 35 },
        { date: "Sun", predicted: 42, actual: null }
    ];

    // Model accuracy data
    const accuracyData = [
        { metric: "Insider Threats", accuracy: 87 },
        { metric: "Data Exfiltration", accuracy: 82 },
        { metric: "Unauthorized Access", accuracy: 79 },
        { metric: "Malware Detection", accuracy: 91 },
        { metric: "Phishing Attempts", accuracy: 85 }
    ];

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "critical": return <Badge variant="destructive" className="animate-pulse-glow">Critical</Badge>;
            case "high": return <Badge className="bg-orange-500">High</Badge>;
            case "medium": return <Badge className="bg-yellow-500">Medium</Badge>;
            case "low": return <Badge className="bg-green-500">Low</Badge>;
            default: return <Badge>Unknown</Badge>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "breach": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "insider_threat": return <Target className="w-5 h-5 text-orange-500" />;
            case "data_exfiltration": return <Zap className="w-5 h-5 text-yellow-500" />;
            case "unauthorized_access": return <Brain className="w-5 h-5 text-blue-500" />;
            default: return <Brain className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Brain className="w-8 h-8 text-primary" />
                    Predictive Intelligence
                </h1>
                <p className="text-muted-foreground mt-1">
                    AI-powered threat forecasting and risk prediction
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card className="glass hover-lift">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-destructive">{predictions.filter(p => p.severity === "critical").length}</div>
                            <div className="text-xs text-muted-foreground mt-1">Critical Predictions</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">{predictions.filter(p => p.severity === "high").length}</div>
                            <div className="text-xs text-muted-foreground mt-1">High Risk</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">85%</div>
                            <div className="text-xs text-muted-foreground mt-1">Model Accuracy</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">72h</div>
                            <div className="text-xs text-muted-foreground mt-1">Avg Prediction Window</div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Threat Trend Forecast */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Threat Trend Forecast
                        </CardTitle>
                        <CardDescription>Predicted vs actual threat levels over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="date" stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fill="url(#colorPredicted)" name="Predicted Threats" />
                                <Area type="monotone" dataKey="actual" stroke="hsl(var(--destructive))" fill="url(#colorActual)" name="Actual Threats" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Model Accuracy */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>AI Model Performance</CardTitle>
                        <CardDescription>Prediction accuracy by threat category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accuracyData.map((item, index) => (
                                <motion.div
                                    key={item.metric}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{item.metric}</span>
                                        <span className="text-sm font-bold text-primary">{item.accuracy}%</span>
                                    </div>
                                    <Progress value={item.accuracy} className="h-2" />
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Predictions List */}
            <div className="space-y-4">
                {predictions.map((prediction, index) => (
                    <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                    >
                        <Card className={`glass hover-lift ${prediction.severity === "critical" ? "border-destructive/50" : ""
                            }`}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {getTypeIcon(prediction.type)}
                                            {prediction.title}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {prediction.description}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getSeverityBadge(prediction.severity)}
                                        <Badge variant="outline">{prediction.timeframe}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Probability */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Probability</span>
                                        <span className="text-sm font-bold text-destructive">{prediction.probability}%</span>
                                    </div>
                                    <Progress value={prediction.probability} className="h-3" />
                                </div>

                                {/* Indicators */}
                                <div>
                                    <div className="text-sm font-medium mb-2">Key Indicators:</div>
                                    <div className="space-y-1">
                                        {prediction.indicators.map((indicator, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                                <span>{indicator}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" />
                                        Recommended Actions:
                                    </div>
                                    <div className="space-y-1">
                                        {prediction.recommendations.map((rec, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                <span>{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PredictiveIntelligence;
