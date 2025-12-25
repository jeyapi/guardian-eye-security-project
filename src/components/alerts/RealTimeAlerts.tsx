import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle2, XCircle, Clock, User, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Alert {
    id: string;
    type: "critical" | "warning" | "info";
    title: string;
    description: string;
    user?: string;
    timestamp: Date;
    acknowledged: boolean;
    details?: string;
}

const RealTimeAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filter, setFilter] = useState<string>("all");

    // Simulate real-time alerts
    useEffect(() => {
        const mockAlerts: Alert[] = [
            {
                id: "1",
                type: "critical",
                title: "Multiple Failed Login Attempts",
                description: "User john.doe has 5 failed login attempts in the last 2 minutes",
                user: "john.doe",
                timestamp: new Date(Date.now() - 2 * 60 * 1000),
                acknowledged: false,
                details: "Source IP: 192.168.1.45 | Location: Unknown"
            },
            {
                id: "2",
                type: "critical",
                title: "Unusual Data Access Pattern",
                description: "Large volume of sensitive files accessed outside business hours",
                user: "jane.smith",
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                acknowledged: false,
                details: "Files accessed: 247 | Time: 02:34 AM"
            },
            {
                id: "3",
                type: "warning",
                title: "Suspicious Network Activity",
                description: "Unusual outbound traffic detected from workstation",
                user: "bob.wilson",
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                acknowledged: true,
                details: "Data transferred: 2.3 GB | Destination: Unknown"
            },
            {
                id: "4",
                type: "warning",
                title: "Password Policy Violation",
                description: "Weak password detected for privileged account",
                user: "alice.brown",
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
                acknowledged: false,
                details: "Account type: Administrator | Password strength: Weak"
            },
            {
                id: "5",
                type: "info",
                title: "New Device Login",
                description: "User logged in from a new device",
                user: "charlie.davis",
                timestamp: new Date(Date.now() - 60 * 60 * 1000),
                acknowledged: true,
                details: "Device: iPhone 15 Pro | Location: Paris, France"
            }
        ];

        setAlerts(mockAlerts);

        // Simulate new alerts coming in
        const interval = setInterval(() => {
            const newAlert: Alert = {
                id: Date.now().toString(),
                type: Math.random() > 0.7 ? "critical" : Math.random() > 0.5 ? "warning" : "info",
                title: "New Security Event Detected",
                description: "Anomalous behavior detected in user activity",
                user: ["john.doe", "jane.smith", "bob.wilson"][Math.floor(Math.random() * 3)],
                timestamp: new Date(),
                acknowledged: false
            };

            setAlerts(prev => [newAlert, ...prev]);

            // Show toast notification
            toast.error(newAlert.title, {
                description: newAlert.description,
                duration: 5000,
            });
        }, 30000); // New alert every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const acknowledgeAlert = (id: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === id ? { ...alert, acknowledged: true } : alert
        ));
        toast.success("Alert acknowledged");
    };

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        toast.info("Alert dismissed");
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "critical": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case "info": return <Bell className="w-5 h-5 text-blue-500" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getAlertBadge = (type: string) => {
        switch (type) {
            case "critical": return <Badge variant="destructive" className="animate-pulse-glow">Critical</Badge>;
            case "warning": return <Badge className="bg-orange-500">Warning</Badge>;
            case "info": return <Badge className="bg-blue-500">Info</Badge>;
            default: return <Badge>Unknown</Badge>;
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (filter === "all") return true;
        if (filter === "unacknowledged") return !alert.acknowledged;
        return alert.type === filter;
    });

    const stats = {
        total: alerts.length,
        critical: alerts.filter(a => a.type === "critical").length,
        warning: alerts.filter(a => a.type === "warning").length,
        unacknowledged: alerts.filter(a => !a.acknowledged).length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Bell className="w-8 h-8 text-primary" />
                    Real-Time Alerts
                </h1>
                <p className="text-muted-foreground mt-1">
                    Instant notifications for critical security events
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card className="glass hover-lift cursor-pointer" onClick={() => setFilter("all")}>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Alerts</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift cursor-pointer border-destructive/30" onClick={() => setFilter("critical")}>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
                            <div className="text-xs text-muted-foreground mt-1">Critical</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift cursor-pointer border-orange-500/30" onClick={() => setFilter("warning")}>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">{stats.warning}</div>
                            <div className="text-xs text-muted-foreground mt-1">Warnings</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass hover-lift cursor-pointer" onClick={() => setFilter("unacknowledged")}>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{stats.unacknowledged}</div>
                            <div className="text-xs text-muted-foreground mt-1">Unacknowledged</div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Alerts List */}
            <AnimatePresence mode="popLayout">
                {filteredAlerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className={`glass hover-lift ${alert.type === "critical" ? "border-destructive/50" :
                                alert.type === "warning" ? "border-orange-500/50" : ""
                            } ${alert.acknowledged ? "opacity-60" : ""}`}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {getAlertIcon(alert.type)}
                                            {alert.title}
                                            {!alert.acknowledged && (
                                                <Badge variant="outline" className="animate-pulse">New</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {alert.timestamp.toLocaleTimeString()}
                                            </span>
                                            {alert.user && (
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {alert.user}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getAlertBadge(alert.type)}
                                        {alert.acknowledged && (
                                            <Badge variant="outline" className="bg-green-500/10">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Acknowledged
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-4">{alert.description}</p>
                                {alert.details && (
                                    <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground mb-4">
                                        {alert.details}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {!alert.acknowledged && (
                                        <Button
                                            size="sm"
                                            onClick={() => acknowledgeAlert(alert.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Acknowledge
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => dismissAlert(alert.id)}
                                        className="flex items-center gap-1"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Dismiss
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredAlerts.length === 0 && (
                <Card className="glass">
                    <CardContent className="py-16">
                        <div className="text-center space-y-4">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                            <div>
                                <h3 className="text-lg font-semibold">All Clear!</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    No alerts matching your filter criteria
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RealTimeAlerts;
