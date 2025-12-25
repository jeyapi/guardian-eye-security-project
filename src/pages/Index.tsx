import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Eye, Lock, Activity, Zap, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Detection",
      description: "Machine learning algorithms identify suspicious patterns and anomalies in real-time",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Continuous surveillance of user activities and behaviors across your network",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Lock,
      title: "Secure Access",
      description: "Enterprise-grade security with JWT authentication and role-based access control",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "Behavioral Analysis",
      description: "Advanced profiling to detect deviations from normal user behavior patterns",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Get notified immediately when critical threats are detected in your system",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Predictive Intelligence",
      description: "Forecast potential security incidents before they occur using AI models",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Detection Accuracy", icon: CheckCircle2 },
    { value: "<100ms", label: "Response Time", icon: Zap },
    { value: "24/7", label: "Monitoring", icon: Activity },
    { value: "1M+", label: "Events Analyzed", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <ScrollReveal direction="up" delay={0.1}>
              <motion.div
                className="flex justify-center mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-2xl glow-primary">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
                <span className="gradient-text">GuardianEye</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                Advanced AI-Powered Insider Threat Detection System
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mt-2">
                Protect your organization from internal security threats with cutting-edge machine learning and behavioral analysis
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="px-8 h-14 text-lg shimmer hover-lift group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Access Dashboard
                    <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 h-14 text-lg glass hover-lift"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="glass-strong rounded-xl p-6 hover-lift"
                    whileHover={{ scale: 1.05 }}
                  >
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Powerful <span className="gradient-text">Features</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Enterprise-grade security tools designed to keep your organization safe
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <motion.div
                    className="glass-strong rounded-2xl p-8 hover-lift group cursor-pointer h-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-[2px] mb-6 group-hover:animate-pulse-glow transition-all`}>
                      <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up">
              <div className="glass-strong rounded-3xl p-12 text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Trusted by Security Teams Worldwide
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Join thousands of organizations protecting their assets with GuardianEye's advanced threat detection
                </p>
                <div className="flex flex-wrap justify-center gap-8 mt-12">
                  {["Real-time Detection", "AI-Powered Analysis", "24/7 Monitoring", "Instant Alerts"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to <span className="gradient-text">Secure</span> Your Organization?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start detecting insider threats today with our advanced AI-powered platform
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="px-12 h-16 text-xl shimmer hover-lift mt-8"
                >
                  Get Started Now
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="max-w-7xl mx-auto text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 GuardianEye. Advanced Insider Threat Detection System.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

