import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import zxcvbn from "zxcvbn";

interface PasswordAnalysis {
    score: number;
    strength: string;
    crackTime: string;
    feedback: string[];
    suggestions: string[];
    passesPolicy: boolean;
    policyChecks: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        numbers: boolean;
        special: boolean;
        commonPassword: boolean;
    };
}

const PasswordAnalyzer = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);

    const analyzePassword = (pwd: string) => {
        if (!pwd) {
            setAnalysis(null);
            return;
        }

        const result = zxcvbn(pwd);

        // Policy checks
        const policyChecks = {
            length: pwd.length >= 12,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            numbers: /[0-9]/.test(pwd),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
            commonPassword: result.score >= 3
        };

        const passesPolicy = Object.values(policyChecks).every(check => check);

        const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

        const analysis: PasswordAnalysis = {
            score: result.score,
            strength: strengthLabels[result.score],
            crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
            feedback: result.feedback.warning ? [result.feedback.warning] : [],
            suggestions: result.feedback.suggestions || [],
            passesPolicy,
            policyChecks
        };

        setAnalysis(analysis);
    };

    const getStrengthColor = (score: number) => {
        switch (score) {
            case 0: return "text-red-500";
            case 1: return "text-orange-500";
            case 2: return "text-yellow-500";
            case 3: return "text-blue-500";
            case 4: return "text-green-500";
            default: return "text-gray-500";
        }
    };

    const getStrengthBg = (score: number) => {
        switch (score) {
            case 0: return "bg-red-500";
            case 1: return "bg-orange-500";
            case 2: return "bg-yellow-500";
            case 3: return "text-blue-500";
            case 4: return "bg-green-500";
            default: return "bg-gray-500";
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
                    <Lock className="w-8 h-8 text-primary" />
                    Password Security Analyzer
                </h1>
                <p className="text-muted-foreground mt-1">
                    Analyze password strength and policy compliance
                </p>
            </motion.div>

            {/* Input Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Enter Password to Analyze</CardTitle>
                        <CardDescription>
                            Test password strength and check against security policies
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    analyzePassword(e.target.value);
                                }}
                                placeholder="Enter password..."
                                className="pr-10"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Analysis Results */}
            {analysis && (
                <>
                    {/* Strength Score */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="glass hover-lift">
                            <CardHeader>
                                <CardTitle>Password Strength</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className={`text-6xl font-bold ${getStrengthColor(analysis.score)}`}>
                                        {analysis.score}/4
                                    </div>
                                    <div className="text-xl font-semibold mt-2">{analysis.strength}</div>
                                </div>
                                <Progress
                                    value={(analysis.score / 4) * 100}
                                    className={`h-3 ${getStrengthBg(analysis.score)}`}
                                />
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                        <div className="text-sm text-muted-foreground">Estimated Crack Time</div>
                                        <div className="text-lg font-bold mt-1">{analysis.crackTime}</div>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                        <div className="text-sm text-muted-foreground">Policy Compliance</div>
                                        <div className="text-lg font-bold mt-1">
                                            {analysis.passesPolicy ? (
                                                <span className="text-green-500">✓ Passes</span>
                                            ) : (
                                                <span className="text-red-500">✗ Fails</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Policy Checks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle>Policy Requirements</CardTitle>
                                <CardDescription>
                                    Password must meet all requirements below
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { key: "length", label: "Minimum 12 characters" },
                                        { key: "uppercase", label: "At least one uppercase letter (A-Z)" },
                                        { key: "lowercase", label: "At least one lowercase letter (a-z)" },
                                        { key: "numbers", label: "At least one number (0-9)" },
                                        { key: "special", label: "At least one special character (!@#$%...)" },
                                        { key: "commonPassword", label: "Not a commonly used password" }
                                    ].map((req, index) => (
                                        <motion.div
                                            key={req.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                                        >
                                            {analysis.policyChecks[req.key as keyof typeof analysis.policyChecks] ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            )}
                                            <span className="text-sm">{req.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Feedback & Suggestions */}
                    {(analysis.feedback.length > 0 || analysis.suggestions.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="glass border-orange-500/30">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {analysis.feedback.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium mb-2">Warnings:</div>
                                            {analysis.feedback.map((warning, index) => (
                                                <div key={index} className="text-sm text-orange-500 mb-1">
                                                    • {warning}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {analysis.suggestions.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium mb-2">Suggestions:</div>
                                            {analysis.suggestions.map((suggestion, index) => (
                                                <div key={index} className="text-sm text-muted-foreground mb-1">
                                                    • {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Best Practices */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="glass border-primary/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Password Best Practices
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div className="font-medium">✓ Do:</div>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• Use a unique password for each account</li>
                                            <li>• Use a password manager</li>
                                            <li>• Enable two-factor authentication</li>
                                            <li>• Use passphrases (4+ random words)</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="font-medium">✗ Don't:</div>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• Reuse passwords across sites</li>
                                            <li>• Use personal information</li>
                                            <li>• Share passwords with others</li>
                                            <li>• Use simple patterns (123, abc, etc.)</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}

            {/* Empty State */}
            {!analysis && (
                <Card className="glass">
                    <CardContent className="py-16">
                        <div className="text-center space-y-4">
                            <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
                            <div>
                                <h3 className="text-lg font-semibold">No Password Entered</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enter a password above to analyze its strength and security
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PasswordAnalyzer;
