"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Diagram creation activity over time"

const chartData = [
  { date: "2024-01-01", diagrams: 12, exports: 28 },
  { date: "2024-01-02", diagrams: 8, exports: 15 },
  { date: "2024-01-03", diagrams: 15, exports: 32 },
  { date: "2024-01-04", diagrams: 22, exports: 41 },
  { date: "2024-01-05", diagrams: 18, exports: 35 },
  { date: "2024-01-06", diagrams: 25, exports: 48 },
  { date: "2024-01-07", diagrams: 14, exports: 26 },
  { date: "2024-01-08", diagrams: 30, exports: 55 },
  { date: "2024-01-09", diagrams: 19, exports: 38 },
  { date: "2024-01-10", diagrams: 21, exports: 42 },
  { date: "2024-01-11", diagrams: 27, exports: 51 },
  { date: "2024-01-12", diagrams: 16, exports: 31 },
  { date: "2024-01-13", diagrams: 24, exports: 46 },
  { date: "2024-01-14", diagrams: 13, exports: 25 },
  { date: "2024-01-15", diagrams: 20, exports: 39 },
]

const chartConfig = {
  activity: {
    label: "Activity",
  },
  diagrams: {
    label: "Diagrams Created",
    color: "var(--primary)",
  },
  exports: {
    label: "Exports Generated",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("7d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-01-15")
    let daysToSubtract = 7
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "15d") {
      daysToSubtract = 15
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Diagram Activity</CardTitle>
            <CardDescription>
              Creation and export trends over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32" size="sm">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="15d" className="rounded-lg">
                Last 15 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDiagrams" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-diagrams)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-diagrams)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExports" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-exports)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-exports)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="exports"
              type="natural"
              fill="url(#fillExports)"
              stroke="var(--color-exports)"
              stackId="a"
            />
            <Area
              dataKey="diagrams"
              type="natural"
              fill="url(#fillDiagrams)"
              stroke="var(--color-diagrams)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}