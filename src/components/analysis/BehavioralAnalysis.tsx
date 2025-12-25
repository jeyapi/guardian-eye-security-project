import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Activity, TrendingUp, Clock, MapPin, Laptop, AlertTriangle, Shield, Calendar, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    BarChart, Bar, Area, AreaChart
} from "recharts";

interface UserProfile {
    userId: string;
    userName: string;
    email: string;
    department: string;
    role: string;
    normalBehavior: {
        avgLoginTime: string;
        avgSessionDuration: number;
        commonLocations: string[];
        commonDevices: string[];
        avgFilesAccessed: number;
        workingHours: string;
        avgDataTransfer: string;
        peakActivityHours: string[];
    };
    currentBehavior: {
        lastLogin: string;
        sessionDuration: number;
        location: string;
        device: string;
        filesAccessed: number;
        dataTransferred: string;
        activeHours: string[];
    };
    deviationScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    anomalies: string[];
    activityTimeline: Array<{
        time: string;
        activity: number;
        normal: number;
    }>;
    accessPatterns: Array<{
        category: string;
        current: number;
        normal: number;
    }>;
}

const BehavioralAnalysis = () => {
    const [selectedUser, setSelectedUser] = useState<string>("1");

    const mockProfiles: UserProfile[] = [
        {
            userId: "1",
            userName: "john.doe",
            email: "john.doe@company.com",
            department: "Engineering",
            role: "Senior Developer",
            normalBehavior: {
                avgLoginTime: "09:00 AM",
                avgSessionDuration: 480,
                commonLocations: ["Paris, France", "Lyon, France"],
                commonDevices: ["MacBook Pro M2", "iPhone 14 Pro"],
                avgFilesAccessed: 45,
                workingHours: "9 AM - 6 PM",
                avgDataTransfer: "250 MB",
                peakActivityHours: ["10 AM", "2 PM", "4 PM"]
            },
            currentBehavior: {
                lastLogin: "02:34 AM",
                sessionDuration: 180,
                location: "Unknown (VPN - Romania)",
                device: "Unknown Linux Device",
                filesAccessed: 247,
                dataTransferred: "2.3 GB",
                activeHours: ["2 AM", "3 AM", "4 AM"]
            },
            deviationScore: 87,
            riskLevel: "critical",
            anomalies: [
                "Login at unusual time (02:34 AM vs avg 09:00 AM) - 7 hours deviation",
                "Accessing from unknown location via VPN (Romania)",
                "Using unrecognized Linux device (normal: MacBook Pro)",
                "Abnormally high file access (247 vs avg 45) - 449% increase",
                "Massive data transfer (2.3 GB vs avg 250 MB) - 820% increase",
                "Activity during off-hours (2-4 AM vs normal 9 AM-6 PM)",
                "VPN usage detected from suspicious region",
                "Pattern matches known data exfiltration behavior"
            ],
            activityTimeline: [
                { time: "12 AM", activity: 0, normal: 0 },
                { time: "2 AM", activity: 85, normal: 0 },
                { time: "4 AM", activity: 92, normal: 0 },
                { time: "6 AM", activity: 45, normal: 5 },
                { time: "8 AM", activity: 12, normal: 30 },
                { time: "10 AM", activity: 8, normal: 85 },
                { time: "12 PM", activity: 5, normal: 70 },
                { time: "2 PM", activity: 3, normal: 90 },
                { time: "4 PM", activity: 2, normal: 80 },
                { time: "6 PM", activity: 0, normal: 40 },
                { time: "8 PM", activity: 0, normal: 10 },
                { time: "10 PM", activity: 0, normal: 0 }
            ],
            accessPatterns: [
                { category: "Source Code", current: 85, normal: 60 },
                { category: "Customer Data", current: 95, normal: 20 },
                { category: "Financial Reports", current: 78, normal: 5 },
                { category: "HR Documents", current: 62, normal: 0 },
                { category: "Infrastructure", current: 88, normal: 40 }
            ]
        },
        {
            userId: "2",
            userName: "jane.smith",
            email: "jane.smith@company.com",
            department: "Marketing",
            role: "Marketing Manager",
            normalBehavior: {
                avgLoginTime: "08:30 AM",
                avgSessionDuration: 510,
                commonLocations: ["London, UK"],
                commonDevices: ["Dell Laptop XPS 15", "Samsung Galaxy S23"],
                avgFilesAccessed: 32,
                workingHours: "8:30 AM - 5:30 PM",
                avgDataTransfer: "180 MB",
                peakActivityHours: ["9 AM", "11 AM", "3 PM"]
            },
            currentBehavior: {
                lastLogin: "08:45 AM",
                sessionDuration: 495,
                location: "London, UK",
                device: "Dell Laptop XPS 15",
                filesAccessed: 28,
                dataTransferred: "165 MB",
                activeHours: ["9 AM", "11 AM", "3 PM"]
            },
            deviationScore: 12,
            riskLevel: "low",
            anomalies: [],
            activityTimeline: [
                { time: "12 AM", activity: 0, normal: 0 },
                { time: "2 AM", activity: 0, normal: 0 },
                { time: "4 AM", activity: 0, normal: 0 },
                { time: "6 AM", activity: 0, normal: 0 },
                { time: "8 AM", activity: 25, normal: 30 },
                { time: "10 AM", activity: 82, normal: 85 },
                { time: "12 PM", activity: 68, normal: 70 },
                { time: "2 PM", activity: 88, normal: 90 },
                { time: "4 PM", activity: 75, normal: 80 },
                { time: "6 PM", activity: 35, normal: 40 },
                { time: "8 PM", activity: 0, normal: 0 },
                { time: "10 PM", activity: 0, normal: 0 }
            ],
            accessPatterns: [
                { category: "Marketing Assets", current: 85, normal: 80 },
                { category: "Campaign Data", current: 75, normal: 70 },
                { category: "Analytics", current: 68, normal: 65 },
                { category: "Social Media", current: 90, normal: 85 },
                { category: "Documents", current: 55, normal: 60 }
            ]
        },
        {
            userId: "3",
            userName: "bob.wilson",
            email: "bob.wilson@company.com",
            department: "Sales",
            role: "Sales Director",
            normalBehavior: {
                avgLoginTime: "10:00 AM",
                avgSessionDuration: 420,
                commonLocations: ["Berlin, Germany"],
                commonDevices: ["ThinkPad X1 Carbon"],
                avgFilesAccessed: 67,
                workingHours: "10 AM - 7 PM",
                avgDataTransfer: "320 MB",
                peakActivityHours: ["11 AM", "1 PM", "5 PM"]
            },
            currentBehavior: {
                lastLogin: "11:30 PM",
                sessionDuration: 240,
                location: "Berlin, Germany",
                device: "ThinkPad X1 Carbon",
                filesAccessed: 156,
                dataTransferred: "890 MB",
                activeHours: ["11 PM", "12 AM", "1 AM"]
            },
            deviationScore: 65,
            riskLevel: "high",
            anomalies: [
                "Login outside working hours (11:30 PM vs normal 10 AM)",
                "High file access volume (156 vs avg 67) - 133% increase",
                "Extended late-night session (4 hours)",
                "Elevated data transfer (890 MB vs avg 320 MB) - 178% increase",
                "Accessing customer database after hours"
            ],
            activityTimeline: [
                { time: "12 AM", activity: 75, normal: 0 },
                { time: "2 AM", activity: 45, normal: 0 },
                { time: "4 AM", activity: 0, normal: 0 },
                { time: "6 AM", activity: 0, normal: 0 },
                { time: "8 AM", activity: 0, normal: 10 },
                { time: "10 AM", activity: 5, normal: 60 },
                { time: "12 PM", activity: 8, normal: 85 },
                { time: "2 PM", activity: 12, normal: 75 },
                { time: "4 PM", activity: 15, normal: 80 },
                { time: "6 PM", activity: 10, normal: 70 },
                { time: "8 PM", activity: 0, normal: 20 },
                { time: "10 PM", activity: 0, normal: 5 }
            ],
            accessPatterns: [
                { category: "Customer CRM", current: 92, normal: 75 },
                { category: "Sales Reports", current: 85, normal: 80 },
                { category: "Contracts", current: 78, normal: 60 },
                { category: "Pricing Data", current: 88, normal: 55 },
                { category: "Competitor Info", current: 70, normal: 40 }
            ]
        }
    ];

    const [profiles] = useState(mockProfiles);

    const getProfile = (userId: string) => profiles.find(p => p.userId === userId);
    const profile = getProfile(selectedUser);

    const getRiskColor = (level: string) => {
        switch (level) {
            case "critical": return "text-red-500";
            case "high": return "text-orange-500";
            case "medium": return "text-yellow-500";
            case "low": return "text-green-500";
            default: return "text-gray-500";
        }
    };

    const getRiskBadge = (level: string) => {
        switch (level) {
            case "critical": return <Badge variant="destructive" className="animate-pulse-glow">Critical Risk</Badge>;
            case "high": return <Badge className="bg-orange-500">High Risk</Badge>;
            case "medium": return <Badge className="bg-yellow-500">Medium Risk</Badge>;
            case "low": return <Badge className="bg-green-500">Low Risk</Badge>;
            default: return <Badge>Unknown</Badge>;
        }
    };

    const getRadarData = (profile: UserProfile) => {
        // Helper to parse time and check if it's within normal working hours
        const isNormalLoginTime = (loginTime: string, normalTime: string) => {
            const loginHour = parseInt(loginTime.split(':')[0]);
            const normalHour = parseInt(normalTime.split(':')[0]);
            const isPM = loginTime.includes('PM');
            const isNormalPM = normalTime.includes('PM');

            let actualHour = isPM && loginHour !== 12 ? loginHour + 12 : loginHour;
            let normalHourActual = isNormalPM && normalHour !== 12 ? normalHour + 12 : normalHour;

            // If login is within 3 hours of normal time, score high
            const diff = Math.abs(actualHour - normalHourActual);
            if (diff <= 3) return 100;
            if (diff <= 6) return 60;
            if (diff <= 12) return 30;
            return 10;
        };

        // Check location match
        const locationScore = profile.normalBehavior.commonLocations.some(loc =>
            profile.currentBehavior.location.includes(loc.split(',')[0])
        ) ? 100 : 15;

        // Check device match
        const deviceScore = profile.normalBehavior.commonDevices.some(dev =>
            profile.currentBehavior.device.includes(dev.split(' ')[0])
        ) ? 100 : 10;

        // File access deviation (clamped between 0-100)
        const fileDeviation = ((profile.currentBehavior.filesAccessed - profile.normalBehavior.avgFilesAccessed) / profile.normalBehavior.avgFilesAccessed) * 100;
        const fileScore = Math.max(0, Math.min(100, 100 - fileDeviation));

        // Data transfer check
        const dataScore = profile.currentBehavior.dataTransferred.includes("GB") ? 15 :
            profile.currentBehavior.dataTransferred.includes("MB") ? 85 : 100;

        // Session duration deviation (clamped between 0-100)
        const sessionDeviation = Math.abs(profile.currentBehavior.sessionDuration - profile.normalBehavior.avgSessionDuration) / profile.normalBehavior.avgSessionDuration * 100;
        const sessionScore = Math.max(0, Math.min(100, 100 - sessionDeviation));

        return [
            {
                metric: "Login Time",
                normal: 100,
                current: isNormalLoginTime(profile.currentBehavior.lastLogin, profile.normalBehavior.avgLoginTime)
            },
            {
                metric: "Location",
                normal: 100,
                current: locationScore
            },
            {
                metric: "Device",
                normal: 100,
                current: deviceScore
            },
            {
                metric: "File Access",
                normal: 100,
                current: Math.round(fileScore)
            },
            {
                metric: "Data Transfer",
                normal: 100,
                current: dataScore
            },
            {
                metric: "Session Time",
                normal: 100,
                current: Math.round(sessionScore)
            }
        ];
    };

    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Activity className="w-8 h-8 text-primary" />
                    Behavioral Analysis
                </h1>
                <p className="text-muted-foreground mt-1">
                    Advanced user profiling and deviation detection
                </p>
            </motion.div>

            {/* User Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profiles.map((p, index) => (
                    <motion.div
                        key={p.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className={`glass hover-lift cursor-pointer transition-all ${selectedUser === p.userId ? "border-primary ring-2 ring-primary/50" : ""
                                } ${p.riskLevel === "critical" ? "border-destructive/50" : ""}`}
                            onClick={() => setSelectedUser(p.userId)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {p.userName}
                                        </CardTitle>
                                        <CardDescription className="mt-1 space-y-1">
                                            <div className="text-xs">{p.email}</div>
                                            <div className="text-xs">{p.department} • {p.role}</div>
                                        </CardDescription>
                                    </div>
                                    {getRiskBadge(p.riskLevel)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium">Deviation Score</span>
                                            <span className={`text-xs font-bold ${getRiskColor(p.riskLevel)}`}>
                                                {p.deviationScore}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={p.deviationScore}
                                            className={`h-2 ${p.riskLevel === "critical" || p.riskLevel === "high" ? "bg-gradient-to-r from-red-500 to-orange-500" : ""}`}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Anomalies</span>
                                        <Badge variant="outline" className={p.anomalies.length > 0 ? "bg-destructive/10" : ""}>
                                            {p.anomalies.length}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Analysis */}
            <motion.div
                key={selectedUser}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* User Info Banner */}
                <Card className={`glass border-2 ${profile.riskLevel === "critical" ? "border-destructive" :
                    profile.riskLevel === "high" ? "border-orange-500" : "border-primary"
                    }`}>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">User</div>
                                    <div className="font-semibold">{profile.userName}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Department</div>
                                    <div className="font-semibold">{profile.department}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile.riskLevel === "critical" ? "bg-destructive/20" : "bg-orange-500/20"
                                    }`}>
                                    <AlertTriangle className={`w-6 h-6 ${getRiskColor(profile.riskLevel)}`} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Risk Level</div>
                                    <div className={`font-semibold ${getRiskColor(profile.riskLevel)}`}>
                                        {profile.riskLevel.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Deviation</div>
                                    <div className="font-semibold text-purple-500">{profile.deviationScore}%</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            24-Hour Activity Timeline
                        </CardTitle>
                        <CardDescription>Current activity vs normal behavior pattern</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={profile.activityTimeline}>
                                <defs>
                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis
                                    dataKey="time"
                                    stroke="hsl(var(--border))"
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                />
                                <YAxis
                                    stroke="hsl(var(--border))"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
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
                                    type="monotone"
                                    dataKey="normal"
                                    stroke="hsl(var(--primary))"
                                    fill="url(#colorNormal)"
                                    name="Normal Activity"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="activity"
                                    stroke="hsl(var(--destructive))"
                                    fill="url(#colorActivity)"
                                    name="Current Activity"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Behavioral Pattern Radar + Access Patterns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Behavioral Pattern Analysis</CardTitle>
                            <CardDescription>6-dimensional behavior comparison</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={getRadarData(profile)}>
                                    <PolarGrid stroke="hsl(var(--border))" />
                                    <PolarAngleAxis
                                        dataKey="metric"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Radar
                                        name="Normal Baseline"
                                        dataKey="normal"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.3}
                                    />
                                    <Radar
                                        name="Current Behavior"
                                        dataKey="current"
                                        stroke="hsl(var(--destructive))"
                                        fill="hsl(var(--destructive))"
                                        fillOpacity={0.3}
                                    />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Access Patterns */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Resource Access Patterns</CardTitle>
                            <CardDescription>Current vs normal access levels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={profile.accessPatterns}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                    <XAxis
                                        dataKey="category"
                                        stroke="hsl(var(--border))"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="normal" fill="hsl(var(--primary))" name="Normal Access" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="current" fill="hsl(var(--destructive))" name="Current Access" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Behavior Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Normal Behavior */}
                    <Card className="glass border-primary/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                Normal Behavior Baseline
                            </CardTitle>
                            <CardDescription>Established behavioral profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { icon: Clock, label: "Avg Login Time", value: profile.normalBehavior.avgLoginTime },
                                { icon: Clock, label: "Working Hours", value: profile.normalBehavior.workingHours },
                                { icon: MapPin, label: "Common Locations", value: profile.normalBehavior.commonLocations.join(", ") },
                                { icon: Laptop, label: "Common Devices", value: profile.normalBehavior.commonDevices.join(", ") },
                                { icon: Activity, label: "Avg Files/Day", value: `${profile.normalBehavior.avgFilesAccessed} files` },
                                { icon: Globe, label: "Avg Data Transfer", value: profile.normalBehavior.avgDataTransfer }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                                >
                                    <item.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-muted-foreground">{item.label}</div>
                                        <div className="text-sm font-medium truncate">{item.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Current Behavior */}
                    <Card className="glass border-destructive/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-destructive" />
                                Current Behavior
                            </CardTitle>
                            <CardDescription>Recent activity analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { icon: Clock, label: "Last Login", value: profile.currentBehavior.lastLogin, alert: !profile.currentBehavior.lastLogin.includes(profile.normalBehavior.avgLoginTime.split(':')[0]) },
                                { icon: Clock, label: "Session Duration", value: `${profile.currentBehavior.sessionDuration} min`, alert: Math.abs(profile.currentBehavior.sessionDuration - profile.normalBehavior.avgSessionDuration) > 100 },
                                { icon: MapPin, label: "Current Location", value: profile.currentBehavior.location, alert: !profile.normalBehavior.commonLocations.some(loc => profile.currentBehavior.location.includes(loc.split(',')[0])) },
                                { icon: Laptop, label: "Current Device", value: profile.currentBehavior.device, alert: !profile.normalBehavior.commonDevices.some(dev => profile.currentBehavior.device.includes(dev.split(' ')[0])) },
                                { icon: Activity, label: "Files Accessed", value: `${profile.currentBehavior.filesAccessed} files`, alert: profile.currentBehavior.filesAccessed > profile.normalBehavior.avgFilesAccessed * 1.5 },
                                { icon: Globe, label: "Data Transferred", value: profile.currentBehavior.dataTransferred, alert: profile.currentBehavior.dataTransferred.includes("GB") }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-start gap-3 p-3 rounded-lg ${item.alert ? "bg-destructive/10 border border-destructive/30" : "bg-muted/30"
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.alert ? "text-destructive" : "text-muted-foreground"
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            {item.label}
                                            {item.alert && <AlertTriangle className="w-3 h-3 text-destructive" />}
                                        </div>
                                        <div className={`text-sm font-medium truncate ${item.alert ? "text-destructive" : ""
                                            }`}>{item.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Detected Anomalies */}
                {profile.anomalies.length > 0 && (
                    <Card className="glass border-orange-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Detected Anomalies ({profile.anomalies.length})
                            </CardTitle>
                            <CardDescription>Behavioral deviations requiring attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {profile.anomalies.map((anomaly, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover-lift"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0 animate-pulse" />
                                        <span className="text-sm flex-1">{anomaly}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendations */}
                <Card className="glass border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Recommended Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {profile.riskLevel === "critical" && [
                                "Immediately suspend user access pending investigation",
                                "Review all recent file access and data transfers",
                                "Conduct urgent security interview with user",
                                "Enable enhanced monitoring and logging",
                                "Notify security team and management",
                                "Preserve forensic evidence for investigation"
                            ].map((action, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                                    <span className="text-sm">{action}</span>
                                </div>
                            ))}
                            {profile.riskLevel === "high" && [
                                "Schedule security review with user",
                                "Increase monitoring frequency",
                                "Review access permissions",
                                "Verify recent activities with manager"
                            ].map((action, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                    <span className="text-sm">{action}</span>
                                </div>
                            ))}
                            {profile.riskLevel === "low" && (
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span className="text-sm">No immediate action required. Continue normal monitoring.</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default BehavioralAnalysis;
