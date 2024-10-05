import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from 'react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
