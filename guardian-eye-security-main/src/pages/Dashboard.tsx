import { useState, useEffect } from "react";
import { logError } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, Users, Brain, AlertTriangle, Info, CheckCircle2, Loader2, Lock, FileText, Search, Bell, Activity, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { API_URL } from "@/config/api";
import AnomalyTable from "@/components/AnomalyTable";
import StatsCard from "@/components/StatsCard";
import AnomalyChart from "@/components/charts/AnomalyChart";
import TopUsersChart from "@/components/charts/TopUsersChart";
import ActivityHeatmap from "@/components/charts/ActivityHeatmap";
import RiskScoreCard from "@/components/charts/RiskScoreCard";
import ExportButtons from "@/components/export/ExportButtons";
import SearchBar from "@/components/filters/SearchBar";
import FilterPanel from "@/components/filters/FilterPanel";
import SkeletonLoader from "@/components/SkeletonLoader";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  // Utilisation d'un typage fort pour les anomalies
  interface Anomaly {
    id: string;
    date: string;
    user_name: string;
    pc: string;
    activity: string;
    anomaly_score: number;
  }
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filteredAnomalies, setFilteredAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState({ total: 0, anomalies: 0, users: 0 });
  const [hasData, setHasData] = useState(false);
  const [hasProfiles, setHasProfiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  // const navigate = useNavigate();

  useEffect(() => {
    loadAnomalies();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAnomalies, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnomalies = async () => {
    try {
      // Load anomalies
      const anomaliesRes = await fetch(`${API_URL}/logs?anomalies=true`);
      const anomaliesData = await anomaliesRes.json();

      if (anomaliesData.success) {
        setAnomalies(anomaliesData.data || []);
      }

      // Load stats
      const statsRes = await fetch(`${API_URL}/stats`);
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
        setHasData(statsData.stats.total > 0);
        setHasProfiles(statsData.stats.users > 0);
      }
    } catch (error) {
      logError("Error loading anomalies:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Filter anomalies based on search and filters
  useEffect(() => {
    let filtered = [...anomalies];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.user_name.toLowerCase().includes(query) ||
        a.pc.toLowerCase().includes(query) ||
        a.activity.toLowerCase().includes(query)
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(a => {
        if (severityFilter === "critical") return a.anomaly_score > 0.7;
        if (severityFilter === "high") return a.anomaly_score >= 0.5 && a.anomaly_score <= 0.7;
        if (severityFilter === "medium") return a.anomaly_score < 0.5;
        return true;
      });
    }

    // Activity filter
    if (activityFilter !== "all") {
      filtered = filtered.filter(a => a.activity === activityFilter);
    }

    setFilteredAnomalies(filtered);
  }, [anomalies, searchQuery, severityFilter, activityFilter]);

  const handleIngest = async () => {
    setLoading(true);
    setLoadingStep("Ingesting data from CSV...");
    setProgress(33);
    try {
      const response = await fetch(`${API_URL}/ingest`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Data ingested successfully");
        setProgress(100);
        await loadAnomalies();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      logError("Ingestion error:", error);
      toast.error("Failed to ingest data. Make sure the backend server is running on port 3001.");
    } finally {
      setLoading(false);
      setLoadingStep("");
      setProgress(0);
    }
  };

  const handleBuildProfiles = async () => {
    setLoading(true);
    setLoadingStep("Building user profiles...");
    setProgress(66);
    try {
      const response = await fetch(`${API_URL}/build-profiles`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "User profiles built successfully");
        setProgress(100);
        setHasProfiles(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      logError("Profile building error:", error);
      toast.error("Failed to build profiles. Please ingest data first.");
    } finally {
      setLoading(false);
      setLoadingStep("");
      setProgress(0);
    }
  };

  const handleDetectAnomalies = async () => {
    setLoading(true);
    setLoadingStep("Detecting anomalies with AI...");
    setProgress(50);
    try {
      const response = await fetch(`${API_URL}/detect-anomalies`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Anomaly detection completed");
        setProgress(100);
        await loadAnomalies();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      logError("Detection error:", error);
      toast.error("Failed to detect anomalies. Please build profiles first.");
    } finally {
      setLoading(false);
      setLoadingStep("");
      setProgress(0);
    }
  };



  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {initialLoading ? (
          <>
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-lg bg-muted skeleton" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded skeleton" />
                <div className="h-4 w-32 bg-muted rounded skeleton" />
              </div>
            </div>
            <SkeletonLoader type="stats" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonLoader type="chart" />
              <SkeletonLoader type="chart" />
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center glow-primary">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">GuardianEye</h1>
                <p className="text-sm text-muted-foreground">Insider Threat Detection</p>
              </div>
            </motion.div>

            {/* Instructions Banner */}
            {!hasData && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Getting Started:</strong> Click the buttons below in order:
                  <span className="font-mono ml-2">1. Ingest Data → 2. Build Profiles → 3. Detect Anomalies</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading Progress */}
            {loading && (
              <Card className="border-primary/50 glass animate-fade-in">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">{loadingStep}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Events"
                value={stats.total}
                icon={Upload}
                description="Device activity logs"
              />
              <StatsCard
                title="Anomalies Detected"
                value={stats.anomalies}
                icon={AlertTriangle}
                description="Suspicious activities"
                variant="alert"
              />
              <StatsCard
                title="Users Monitored"
                value={stats.users}
                icon={Users}
                description="Active user accounts"
              />
            </div>

            {/* Actions */}
            <Card className="border-border glass hover-lift">
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Manage data ingestion and threat detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleIngest}
                    disabled={loading}
                    className="w-full h-20 flex-col gap-2"
                    variant={hasData ? "outline" : "default"}
                  >
                    {hasData ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Upload className="w-5 h-5" />}
                    <span>Ingest Data</span>
                    {hasData && <span className="text-xs text-muted-foreground">✓ Completed</span>}
                  </Button>
                  <Button
                    onClick={handleBuildProfiles}
                    disabled={loading || !hasData}
                    className="w-full h-20 flex-col gap-2"
                    variant={hasProfiles ? "outline" : "secondary"}
                  >
                    {hasProfiles ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Users className="w-5 h-5" />}
                    <span>Build Profiles</span>
                    {hasProfiles && <span className="text-xs text-muted-foreground">✓ Completed</span>}
                  </Button>
                  <Button
                    onClick={handleDetectAnomalies}
                    disabled={loading || !hasProfiles}
                    className="w-full h-20 flex-col gap-2"
                  >
                    <Brain className="w-5 h-5" />
                    <span>Detect Anomalies</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Professional Security Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Professional Security Modules
                  </CardTitle>
                  <CardDescription>Advanced security analysis and reporting tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/vulnerabilities')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-5 h-5 text-destructive" />
                        <span className="font-semibold">Vulnerability Scanner</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Scan for CVEs and security vulnerabilities
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/passwords')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold">Password Analyzer</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Analyze password strength and policy compliance
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/reports')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Report Generator</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Generate professional PDF security reports
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI-Powered Features
                  </CardTitle>
                  <CardDescription>Advanced threat detection and prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/alerts')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">Real-Time Alerts</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Instant notifications for critical security events
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/behavioral-analysis')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Behavioral Analysis</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Advanced user profiling and deviation detection
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start p-4 hover-lift"
                      onClick={() => window.location.assign('/predictive-intelligence')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">Predictive Intelligence</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        AI-powered threat forecasting and risk prediction
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            {anomalies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnomalyChart anomalies={anomalies} />
                    <TopUsersChart anomalies={anomalies} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ActivityHeatmap anomalies={anomalies} />
                    <RiskScoreCard anomalies={anomalies} />
                  </div>
                </>
              </motion.div>
            )}

            {/* Anomalies Table */}
            <Card className="border-border glass">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-alert" />
                      Detected Anomalies
                      {filteredAnomalies.length > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                          ({filteredAnomalies.length} {searchQuery || severityFilter !== "all" || activityFilter !== "all" ? `of ${anomalies.length}` : ""} found)
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Recent suspicious activities requiring investigation
                    </CardDescription>
                  </div>
                  <ExportButtons anomalies={filteredAnomalies} />
                </div>

                {/* Search and Filters */}
                {anomalies.length > 0 && (
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                    <FilterPanel
                      severityFilter={severityFilter}
                      onSeverityChange={setSeverityFilter}
                      activityFilter={activityFilter}
                      onActivityChange={setActivityFilter}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <AnomalyTable anomalies={filteredAnomalies} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
