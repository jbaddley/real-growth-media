"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, Ref, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

const baseStyles = {
  solid:
    "inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors",
  outline:
    "inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors",
};

const variantStyles = {
  solid: {
    cyan: "relative overflow-hidden bg-cyan-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-cyan-600 active:text-white/80 before:transition-colors",
    white: "bg-white text-cyan-900 hover:bg-white/90 active:bg-white/90 active:text-cyan-900/70",
    gray: "bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-800 active:text-white/80",
  },
  outline: {
    gray: "border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-100 active:text-gray-700/80",
  },
};

interface ButtonProps {
  href?: string;
  variant?: "solid" | "outline";
  color?: "white" | "gray" | "cyan";
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}

function LinkButton(
  { variant = "solid", color = "gray", className, href, type, onClick, ...props }: ButtonProps,
  ref: Ref<HTMLAnchorElement> | Ref<HTMLButtonElement>
) {
  className = clsx(baseStyles[variant], variantStyles[variant][color], className);

  return href ? (
    <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={className} {...props} />
  ) : (
    <button onClick={onClick} type={type} ref={ref as Ref<HTMLButtonElement>} className={className} {...props} />
  );
}

export default forwardRef(LinkButton);
