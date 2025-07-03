"use client";

import { Portal } from "@radix-ui/react-portal";
import { CONFIG } from "@/global-config";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export type SplashScreenProps = {
  portal?: boolean;
  className?: string;
};

export function SplashScreen({ portal = true }: SplashScreenProps) {
  const content = (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-52 h-52">
        <DotLottieReact
          src={`${CONFIG.assetsDir}/logo/logo.json`}
          loop
          autoplay
        />
      </div>
    </div>
  );

  return portal ? <Portal>{content}</Portal> : content;
}
