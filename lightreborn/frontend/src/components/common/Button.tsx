"use client"

import type React from "react"
import type { ButtonHTMLAttributes } from "react"
import { colors } from "@/constants/colors"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-md font-medium transition-colors focus:outline-none"

  const variantStyles = {
    primary: `bg-[${colors.primary.main}] text-white hover:bg-[${colors.primary.dark}]`,
    secondary: `bg-[${colors.secondary.main}] text-[${colors.secondary.contrastText}] hover:bg-[${colors.secondary.dark}]`,
    outline: `border border-[${colors.primary.main}] text-[${colors.primary.main}] hover:bg-[${colors.primary.light}]`,
    text: `text-[${colors.primary.main}] hover:bg-[${colors.primary.light}]`,
  }

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  const widthStyle = fullWidth ? "w-full" : ""

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  )
}
