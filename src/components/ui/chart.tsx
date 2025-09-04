"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts"
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"
import { Payload } from "recharts/types/component/DefaultTooltipContent"

// ✅ Correct Tooltip payload type
type TooltipPayload = Payload<ValueType, NameType>

// ✅ Custom Tooltip Props
type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
  className?: string
  color?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  nameKey?: string
  labelFormatter?: (value: string | number, payload?: TooltipPayload[]) => React.ReactNode
  labelClassName?: string
  formatter?: (value: ValueType, entry: TooltipPayload) => React.ReactNode
}

export function CustomTooltip({
  active,
  payload,
  label,
  className,
  color,
  hideLabel,
  hideIndicator,
  nameKey,
  labelFormatter,
  labelClassName,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className={`rounded-md border bg-white p-2 shadow-md ${className || ""}`}>
      {!hideLabel && (
        <div className={`mb-1 font-medium ${labelClassName || ""}`}>
          {labelFormatter ? labelFormatter(label!, payload) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            {!hideIndicator && (
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color || color }}
              />
            )}
            {/* ✅ Coerce to string to fix TS error */}
            <span className="mr-2">{String(nameKey ? (item as any)[nameKey] : item.name ?? "Unknown")}:</span>
            <span className="font-medium">
                {formatter ? formatter(item.value ?? "", item) : item.value ?? ""}
           </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ Custom Legend Types
type CustomLegendItem = {
  color?: string
  value: string
}

type CustomLegendProps = React.ComponentProps<"div"> & {
  payload?: CustomLegendItem[]
  verticalAlign?: "top" | "bottom" | "middle"
  hideIcon?: boolean
  nameKey?: string
}

export const CustomLegend = React.forwardRef<HTMLDivElement, CustomLegendProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    if (!payload || payload.length === 0) return null

    return (
      <div
        ref={ref}
        className={`flex flex-wrap gap-4 ${className || ""}`}
        style={{ justifyContent: verticalAlign === "middle" ? "center" : "flex-start" }}
      >
        {payload.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            {!hideIcon && (
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{String(nameKey ? (item as any)[nameKey] : item.value)}</span>
          </div>
        ))}
      </div>
    )
  }
)
CustomLegend.displayName = "CustomLegend"

export function ExampleChart() {
  const data = [
    { name: "Jan", uv: 400, pv: 2400 },
    { name: "Feb", uv: 300, pv: 2210 },
    { name: "Mar", uv: 200, pv: 2290 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="uv" fill="#8884d8" />
        <Bar dataKey="pv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
