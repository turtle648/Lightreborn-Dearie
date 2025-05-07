import type React from "react"
import type { ReactNode } from "react"
import { colors } from "@/constants/colors"

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children, className = "", headerRight }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}
      style={{ borderColor: colors.table.border }}
    >
      {title && (
        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.table.border }}>
          <h3 className="font-medium text-lg" style={{ color: colors.text.primary }}>
            {title}
          </h3>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
