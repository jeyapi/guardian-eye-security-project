import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ActivityHeatmapProps {
    anomalies: Array<{
        date: string;
        user_name: string;
    }>;
}

const ActivityHeatmap = ({ anomalies }: ActivityHeatmapProps) => {
    // Create heatmap data: hours (0-23) x days of week (0-6)
    const heatmapData = Array(7).fill(0).map(() => Array(24).fill(0));

    anomalies.forEach(anomaly => {
        const date = new Date(anomaly.date);
        const hour = date.getHours();
        const day = date.getDay(); // 0 = Sunday
        heatmapData[day][hour]++;
    });

    // Find max value for color scaling
    const maxValue = Math.max(...heatmapData.flat());

    const getColor = (value: number) => {
        if (value === 0) return 'bg-muted';
        const intensity = value / maxValue;
        if (intensity > 0.7) return 'bg-destructive';
        if (intensity > 0.4) return 'bg-orange-500';
        if (intensity > 0.2) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    if (anomalies.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Activity Heatmap
                    </CardTitle>
                    <CardDescription>No data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Run anomaly detection to see activity patterns
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activity Heatmap
                </CardTitle>
                <CardDescription>Anomaly distribution by day and hour</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Hour labels */}
                        <div className="flex mb-1">
                            <div className="w-12"></div>
                            {hours.map(hour => (
                                <div
                                    key={hour}
                                    className="w-6 text-xs text-center text-muted-foreground"
                                >
                                    {hour % 6 === 0 ? hour : ''}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap grid */}
                        {days.map((day, dayIndex) => (
                            <div key={day} className="flex items-center mb-1">
                                <div className="w-12 text-xs font-medium text-muted-foreground">
                                    {day}
                                </div>
                                {hours.map(hour => {
                                    const value = heatmapData[dayIndex][hour];
                                    return (
                                        <div
                                            key={hour}
                                            className={`w-6 h-6 ${getColor(value)} rounded-sm mx-px transition-colors hover:ring-2 hover:ring-primary cursor-pointer`}
                                            title={`${day} ${hour}:00 - ${value} anomalies`}
                                        />
                                    );
                                })}
                            </div>
                        ))}

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 text-xs">
                            <span className="text-muted-foreground">Less</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-4 bg-muted rounded-sm"></div>
                                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                                <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-4 h-4 bg-destructive rounded-sm"></div>
                            </div>
                            <span className="text-muted-foreground">More</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityHeatmap;
