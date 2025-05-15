"use client"

import type React from "react"
import type { ButtonHTMLAttributes } from "react"
// import { colors } from "@/constants/colors"

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
  primary: "bg-[#6B9AFF] text-white hover:bg-[#4B7BFF]",
  secondary: "bg-[#FFD166] text-[#333333] hover:bg-[#FFBA33]",
  outline: "border border-[#6B9AFF] text-[#6B9AFF] hover:bg-[#E8F1FF]",
  text: "text-[#6B9AFF] hover:bg-[#E8F1FF]",
}


  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  const widthStyle = fullWidth ? "w-full" : ""

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
