import { useEffect, useRef, useState } from "react";

interface CountUpAnimationProps {
    end: number;
    duration?: number;
    start?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}

const CountUpAnimation = ({
    end,
    duration = 2000,
    start = 0,
    className = "",
    suffix = "",
    prefix = "",
}: CountUpAnimationProps) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const currentCount = Math.floor(start + (end - start) * easeOutQuart);

            if (currentCount !== countRef.current) {
                countRef.current = currentCount;
                setCount(currentCount);
            }

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, start]);

    return (
        <span className={className}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
};

export default CountUpAnimation;
