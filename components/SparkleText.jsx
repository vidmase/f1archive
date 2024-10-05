import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export const SparkleText = ({ children }) => {
    return (
        <span className="relative inline-block">
            <span className="absolute inset-0 z-0">
                <SparklesCore
                    id="tsparticles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.5}
                    particleDensity={300}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </span>
            <span className="relative z-10 pointer-events-none">{children}</span>
        </span>
    );
};
