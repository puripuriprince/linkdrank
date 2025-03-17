"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Portal } from "@radix-ui/react-portal";
import Image from "next/image";
import { CONFIG } from "@/global-config";

export type SplashScreenProps = {
  portal?: boolean;
  className?: string;
};

export function SplashScreen({ portal = true, className }: SplashScreenProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        className,
      )}
    >
      <Image
        src={`${CONFIG.assetsDir}/logo/logo.svg`}
        alt="Logo"
        width={128}
        height={128}
        className="animate-bounce w-48 h-48"
      />
    </motion.div>
  );

  return portal ? <Portal>{content}</Portal> : content;
}
