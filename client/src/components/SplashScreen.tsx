import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        // Start exit animation after delay
        const timer = setTimeout(() => {
            setExit(true);
        }, 2000);

        // Call onComplete after exit animation finishes
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2800); // 2000ms + 800ms exit duration

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary text-white"
            initial={{ y: 0 }}
            animate={exit ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-center"
            >
                <div className="mb-6 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Package className="h-12 w-12 text-accent" />
                    </div>
                </div>
                <h1 className="font-serif text-4xl font-bold tracking-tight md:text-6xl">
                    GOODWILL GLOBAL EXPORTS
                </h1>
                <motion.p
                    className="mt-4 text-lg text-primary-foreground/80 font-light tracking-widest uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Premium Quality • Global Reach
                </motion.p>
            </motion.div>
        </motion.div>
    );
}
