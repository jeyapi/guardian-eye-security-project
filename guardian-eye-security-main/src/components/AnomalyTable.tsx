import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Anomaly {
  id: string;
  date: string;
  user_name: string;
  pc: string;
  activity: string;
  anomaly_score: number;
}

interface AnomalyTableProps {
  anomalies: Anomaly[];
}

const AnomalyTable = ({ anomalies }: AnomalyTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreBadge = (score: number) => {
    if (score > 0.7) return <Badge variant="destructive">Critical</Badge>;
    if (score > 0.5) return <Badge className="bg-warning text-warning-foreground">High</Badge>;
    return <Badge variant="secondary">Medium</Badge>;
  };

  if (anomalies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No anomalies detected yet. Run detection to analyze your data.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>PC</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anomalies.map((anomaly) => (
            <TableRow key={anomaly.id} className="hover:bg-secondary/30">
              <TableCell className="font-mono text-sm">
                {formatDate(anomaly.date)}
              </TableCell>
              <TableCell className="font-medium">{anomaly.user_name}</TableCell>
              <TableCell className="text-muted-foreground">{anomaly.pc}</TableCell>
              <TableCell>
                <Badge variant={anomaly.activity === "Connect" ? "outline" : "secondary"}>
                  {anomaly.activity}
                </Badge>
              </TableCell>
              <TableCell>{getScoreBadge(anomaly.anomaly_score)}</TableCell>
              <TableCell className="text-right font-mono">
                {anomaly.anomaly_score.toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnomalyTable;
