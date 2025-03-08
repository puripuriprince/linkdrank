import {twMerge} from 'tw-merge';
import {clsx, ClassValue} from 'clsx';

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}