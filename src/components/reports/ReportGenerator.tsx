import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2, CheckCircle2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
    title: string;
    generatedAt: string;
    summary: {
        totalAnomalies: number;
        criticalVulnerabilities: number;
        riskScore: number;
        complianceScore: number;
    };
    vulnerabilities: Array<{
        title: string;
        severity: string;
        status: string;
    }>;
    topThreats: Array<{
        user: string;
        anomalyCount: number;
        riskScore: number;
    }>;
}

const ReportGenerator = () => {
    const [generating, setGenerating] = useState(false);
    const [reportType, setReportType] = useState<string | null>(null);

    const mockReportData: ReportData = {
        title: "GuardianEye Security Report",
        generatedAt: new Date().toLocaleString(),
        summary: {
            totalAnomalies: 147,
            criticalVulnerabilities: 3,
            riskScore: 72,
            complianceScore: 85
        },
        vulnerabilities: [
            { title: "SQL Injection in Auth Module", severity: "Critical", status: "Open" },
            { title: "XSS in Dashboard", severity: "High", status: "In Progress" },
            { title: "Weak Password Policy", severity: "Medium", status: "Open" },
            { title: "Outdated SSL/TLS", severity: "Medium", status: "Resolved" },
            { title: "Missing Security Headers", severity: "Low", status: "Open" }
        ],
        topThreats: [
            { user: "john.doe", anomalyCount: 23, riskScore: 87 },
            { user: "jane.smith", anomalyCount: 18, riskScore: 75 },
            { user: "bob.wilson", anomalyCount: 15, riskScore: 68 }
        ]
    };

    const generateExecutiveReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header with logo area
        doc.setFillColor(23, 23, 23);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("GuardianEye", 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(100, 200, 255);
        doc.text("Security Report - Executive Summary", 20, 33);

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Report Info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${mockReportData.generatedAt}`, 20, 50);

        // Executive Summary Section
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Executive Summary", 20, 65);

        // Summary Cards
        const summaryY = 75;
        const cardWidth = 40;
        const cardHeight = 25;
        const gap = 5;

        const summaryItems = [
            { label: "Total Anomalies", value: mockReportData.summary.totalAnomalies, color: [255, 100, 100] },
            { label: "Critical Vulns", value: mockReportData.summary.criticalVulnerabilities, color: [255, 150, 50] },
            { label: "Risk Score", value: `${mockReportData.summary.riskScore}%`, color: [255, 200, 50] },
            { label: "Compliance", value: `${mockReportData.summary.complianceScore}%`, color: [100, 200, 100] }
        ];

        summaryItems.forEach((item, index) => {
            const x = 20 + (index * (cardWidth + gap));

            // Card background
            doc.setFillColor(245, 245, 245);
            doc.roundedRect(x, summaryY, cardWidth, cardHeight, 2, 2, 'F');

            // Value
            doc.setFontSize(20);
            doc.setTextColor(item.color[0], item.color[1], item.color[2]);
            doc.text(String(item.value), x + cardWidth / 2, summaryY + 12, { align: 'center' });

            // Label
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(item.label, x + cardWidth / 2, summaryY + 20, { align: 'center' });
        });

        // Vulnerabilities Table
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Top Vulnerabilities", 20, 115);

        autoTable(doc, {
            startY: 120,
            head: [['Vulnerability', 'Severity', 'Status']],
            body: mockReportData.vulnerabilities.map(v => [v.title, v.severity, v.status]),
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 9 }
        });

        // Top Threats Table
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Top Suspicious Users", 20, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['User', 'Anomalies', 'Risk Score']],
            body: mockReportData.topThreats.map(t => [t.user, String(t.anomalyCount), `${t.riskScore}%`]),
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 9 }
        });

        // Recommendations
        const recY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Key Recommendations", 20, recY);

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const recommendations = [
            "1. Immediately patch critical SQL injection vulnerability",
            "2. Implement stronger password policies (12+ chars, complexity)",
            "3. Review and investigate top 3 suspicious users",
            "4. Update SSL/TLS configuration to disable legacy protocols",
            "5. Implement missing security headers (CSP, X-Frame-Options)"
        ];

        recommendations.forEach((rec, index) => {
            doc.text(rec, 20, recY + 8 + (index * 7));
        });

        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("GuardianEye - AI-Powered Insider Threat Detection", pageWidth / 2, pageHeight - 10, { align: 'center' });

        return doc;
    };

    const generateComplianceReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(23, 23, 23);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("GuardianEye", 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(100, 200, 255);
        doc.text("Compliance Report - ISO 27001 / NIST", 20, 33);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${mockReportData.generatedAt}`, 20, 50);

        // Compliance Score
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Overall Compliance Score", 20, 65);

        doc.setFontSize(48);
        doc.setTextColor(100, 200, 100);
        doc.text(`${mockReportData.summary.complianceScore}%`, 20, 85);

        // Compliance Frameworks
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Framework Compliance", 20, 105);

        autoTable(doc, {
            startY: 110,
            head: [['Framework', 'Score', 'Status']],
            body: [
                ['ISO 27001:2013', '87%', 'Compliant'],
                ['NIST CSF', '85%', 'Compliant'],
                ['GDPR', '92%', 'Compliant'],
                ['SOC 2 Type II', '78%', 'Partially Compliant']
            ],
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 10 }
        });

        // Control Categories
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Control Categories", 20, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Category', 'Implemented', 'Total', 'Percentage']],
            body: [
                ['Access Control', '45', '50', '90%'],
                ['Cryptography', '12', '15', '80%'],
                ['Physical Security', '18', '20', '90%'],
                ['Operations Security', '28', '35', '80%'],
                ['Communications Security', '15', '18', '83%'],
                ['System Acquisition', '22', '25', '88%']
            ],
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 9 }
        });

        // Gaps and Recommendations
        const recY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Identified Gaps", 20, recY);

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const gaps = [
            "• Incomplete incident response procedures documentation",
            "• Missing regular security awareness training records",
            "• Insufficient backup and recovery testing frequency",
            "• Incomplete vendor security assessment process"
        ];

        gaps.forEach((gap, index) => {
            doc.text(gap, 20, recY + 8 + (index * 7));
        });

        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("GuardianEye - Compliance & Audit Management", pageWidth / 2, pageHeight - 10, { align: 'center' });

        return doc;
    };

    const generateTechnicalReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(23, 23, 23);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("GuardianEye", 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(100, 200, 255);
        doc.text("Technical Security Report", 20, 33);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${mockReportData.generatedAt}`, 20, 50);

        // Vulnerability Details
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Detailed Vulnerability Analysis", 20, 65);

        autoTable(doc, {
            startY: 70,
            head: [['CVE', 'Title', 'CVSS', 'Severity', 'Status']],
            body: [
                ['CVE-2024-1234', 'SQL Injection', '9.8', 'Critical', 'Open'],
                ['CVE-2024-5678', 'XSS Vulnerability', '7.5', 'High', 'In Progress'],
                ['N/A', 'Weak Password Policy', '5.3', 'Medium', 'Open'],
                ['N/A', 'Outdated SSL/TLS', '5.0', 'Medium', 'Resolved'],
                ['N/A', 'Missing Headers', '3.1', 'Low', 'Open']
            ],
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 8 }
        });

        // Anomaly Detection Results
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Anomaly Detection Results", 20, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['User', 'Anomalies', 'Risk Score', 'Last Activity']],
            body: [
                ['john.doe', '23', '87%', '2024-11-23 12:45'],
                ['jane.smith', '18', '75%', '2024-11-23 11:30'],
                ['bob.wilson', '15', '68%', '2024-11-23 10:15'],
                ['alice.brown', '12', '62%', '2024-11-23 09:00'],
                ['charlie.davis', '10', '55%', '2024-11-22 16:30']
            ],
            theme: 'grid',
            headStyles: { fillColor: [23, 23, 23] },
            styles: { fontSize: 9 }
        });

        // Technical Recommendations
        const recY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Technical Remediation Steps", 20, recY);

        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const steps = [
            "1. SQL Injection (CVE-2024-1234):",
            "   - Apply patch AUTH-2024-001 immediately",
            "   - Implement parameterized queries in auth module",
            "   - Add input validation and sanitization",
            "",
            "2. XSS Vulnerability (CVE-2024-5678):",
            "   - Implement Content Security Policy (CSP)",
            "   - Use DOMPurify for user-generated content",
            "   - Enable HttpOnly and Secure flags on cookies"
        ];

        steps.forEach((step, index) => {
            doc.text(step, 20, recY + 8 + (index * 5));
        });

        // Footer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("GuardianEye - Technical Security Analysis", pageWidth / 2, pageHeight - 10, { align: 'center' });

        return doc;
    };

    const handleGenerateReport = async (type: string) => {
        setGenerating(true);
        setReportType(type);

        // Simulate generation time
        await new Promise(resolve => setTimeout(resolve, 2000));

        let doc;
        switch (type) {
            case "executive":
                doc = generateExecutiveReport();
                doc.save("GuardianEye_Executive_Report.pdf");
                break;
            case "compliance":
                doc = generateComplianceReport();
                doc.save("GuardianEye_Compliance_Report.pdf");
                break;
            case "technical":
                doc = generateTechnicalReport();
                doc.save("GuardianEye_Technical_Report.pdf");
                break;
        }

        setGenerating(false);
        setReportType(null);
    };

    const reportTypes = [
        {
            id: "executive",
            title: "Executive Summary",
            description: "High-level overview for leadership with key metrics and recommendations",
            icon: BarChart3,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "compliance",
            title: "Compliance Report",
            description: "Detailed compliance status for ISO 27001, NIST, GDPR, and SOC 2",
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500"
        },
        {
            id: "technical",
            title: "Technical Report",
            description: "In-depth technical analysis with vulnerability details and remediation steps",
            icon: FileText,
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="w-8 h-8 text-primary" />
                    Report Generator
                </h1>
                <p className="text-muted-foreground mt-1">
                    Generate professional security reports in PDF format
                </p>
            </motion.div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportTypes.map((report, index) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass hover-lift h-full">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
                                    <report.icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle>{report.title}</CardTitle>
                                <CardDescription>{report.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => handleGenerateReport(report.id)}
                                    disabled={generating}
                                    className="w-full"
                                >
                                    {generating && reportType === report.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Generate PDF
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Report Features</CardTitle>
                        <CardDescription>All reports include the following</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Professional branding and formatting",
                                "Executive summary with key metrics",
                                "Detailed vulnerability analysis",
                                "Risk scoring and prioritization",
                                "Compliance status and gaps",
                                "Actionable recommendations",
                                "Charts and visualizations",
                                "Export to PDF format"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ReportGenerator;
