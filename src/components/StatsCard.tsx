import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import CountUpAnimation from "./CountUpAnimation";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  variant?: "default" | "alert";
}

const StatsCard = ({ title, value, icon: Icon, description, variant = "default" }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`border-border glass hover-lift h-full ${variant === "alert" ? "border-alert/30 glow-danger" : ""
        }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <p className={`text-4xl font-bold ${variant === "alert" ? "text-alert gradient-text" : "text-foreground"
                }`}>
                <CountUpAnimation end={value} duration={1500} />
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <motion.div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${variant === "alert"
                  ? "bg-gradient-to-br from-alert/20 to-alert/10"
                  : "bg-gradient-to-br from-primary/20 to-primary/10"
                }`}
              animate={{
                scale: variant === "alert" ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: variant === "alert" ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <Icon className={`w-7 h-7 ${variant === "alert" ? "text-alert" : "text-primary"
                }`} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;

