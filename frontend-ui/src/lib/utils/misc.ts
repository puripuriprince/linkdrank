import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tw-merge";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}

//example: https://www.linkedin.com/in/amine-arrachid-3468922aa/
export function getHandeFromLinkedInURL(url: string) {
  if (!url) return "";
  const normalizedUrl = url.replace(/\/$/, "");
  return normalizedUrl.split("/").pop();
}

export const slugifyQuery = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
