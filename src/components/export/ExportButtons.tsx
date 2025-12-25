import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonsProps {
    anomalies: Array<any>;
    filename?: string;
}

const ExportButtons = ({ anomalies, filename = "guardian-eye-anomalies" }: ExportButtonsProps) => {

    const exportToCSV = () => {
        if (anomalies.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Create CSV content
        const headers = ["ID", "Date", "User", "PC", "Activity", "Anomaly Score", "Is Anomaly"];
        const rows = anomalies.map(a => [
            a.id,
            new Date(a.date).toLocaleString(),
            a.user_name,
            a.pc,
            a.activity,
            a.anomaly_score.toFixed(3),
            a.is_anomaly ? "Yes" : "No"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        // Download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${anomalies.length} records to CSV`);
    };

    const exportToJSON = () => {
        if (anomalies.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Create JSON content
        const jsonContent = JSON.stringify({
            exported_at: new Date().toISOString(),
            total_records: anomalies.length,
            data: anomalies
        }, null, 2);

        // Download file
        const blob = new Blob([jsonContent], { type: "application/json" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${anomalies.length} records to JSON`);
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={anomalies.length === 0}
                className="gap-2"
            >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={exportToJSON}
                disabled={anomalies.length === 0}
                className="gap-2"
            >
                <FileJson className="w-4 h-4" />
                Export JSON
            </Button>
        </div>
    );
};

export default ExportButtons;
