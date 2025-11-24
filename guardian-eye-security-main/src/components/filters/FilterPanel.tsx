import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterPanelProps {
    severityFilter: string;
    onSeverityChange: (value: string) => void;
    activityFilter: string;
    onActivityChange: (value: string) => void;
}

const FilterPanel = ({
    severityFilter,
    onSeverityChange,
    activityFilter,
    onActivityChange
}: FilterPanelProps) => {
    return (
        <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
                <Label htmlFor="severity-filter" className="text-sm font-medium">
                    Severity
                </Label>
                <Select value={severityFilter} onValueChange={onSeverityChange}>
                    <SelectTrigger id="severity-filter" className="w-[150px]">
                        <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical (&gt;0.7)</SelectItem>
                        <SelectItem value="high">High (0.5-0.7)</SelectItem>
                        <SelectItem value="medium">Medium (&lt;0.5)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activity-filter" className="text-sm font-medium">
                    Activity Type
                </Label>
                <Select value={activityFilter} onValueChange={onActivityChange}>
                    <SelectTrigger id="activity-filter" className="w-[150px]">
                        <SelectValue placeholder="All Activities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="Connect">Connect</SelectItem>
                        <SelectItem value="Disconnect">Disconnect</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FilterPanel;
