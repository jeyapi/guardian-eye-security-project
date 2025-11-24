import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ScrollRevealProps {
    children: ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    className?: string;
}

const ScrollReveal = ({
    children,
    direction = "up",
    delay = 0,
    duration = 0.6,
    className = "",
}: ScrollRevealProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const directions = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { y: 0, x: 30 },
        right: { y: 0, x: -30 },
    };

    const { x, y } = directions[direction];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x, y }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
