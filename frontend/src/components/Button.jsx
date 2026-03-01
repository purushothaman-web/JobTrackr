import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Button = React.forwardRef(
  (
    { className, variant = "primary", size = "md", children, text, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-50 disabled:pointer-events-none rounded-none";

    const variants = {
      primary: "bg-electric text-obsidian hover:bg-electric-hover",
      secondary: "bg-obsidian-light text-offwhite border border-border hover:bg-zinc-800",
      ghost: "text-zinc-400 hover:text-offwhite hover:bg-obsidian-light",
      danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs tracking-wide",
      md: "h-11 px-6 text-sm tracking-wide uppercase",
      lg: "h-14 px-8 text-base tracking-wider uppercase",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children || text}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
