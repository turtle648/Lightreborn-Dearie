import type React from "react"
import type { ReactNode } from "react"
import { colors } from "@/constants/colors"

interface CardProps {
  title?: string
  subTitle?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
  subHeaderRight?: ReactNode
}

export const Card: React.FC<CardProps> = ({ title, subTitle, children, className = "", headerRight, subHeaderRight }) => {
  return (  
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden border-b flex flex-col ${className}`}
      style={{ borderColor: colors.table.border }}
    >
      {title && (
        <div className="p-4 border-b" style={{ borderColor: colors.table.border }}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg" style={{ color: colors.text.primary }}>
              {title}
            </h3>
            {headerRight && <div>{headerRight}</div>}
          </div>
          
          {subTitle && (
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {subTitle}
              </p>
              {subHeaderRight && <div>{subHeaderRight}</div>}
            </div>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
