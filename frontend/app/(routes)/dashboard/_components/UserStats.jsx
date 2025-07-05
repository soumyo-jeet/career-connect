"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { aiAnalysis } from "@/app/actions/AIHelps"

export const description = "Job application analytics"

const chartConfig = {
  jobsCreated: {
    label: "Jobs Created",
    color: "var(--chart-1)",
  },
  jobsApplied: {
    label: "Jobs Applied",
    color: "var(--chart-2)",
  },
  jobsSelected: {
    label: "Selected",
    color: "var(--chart-3)",
  },
  jobsRejected: {
    label: "Rejected",
    color: "var(--chart-4)",
  },
}

export function UserStats({ 
  jobsCreated = 0,
  jobsApplied = 0,
  jobsSelected = 0,
  jobsRejected = 0,
}) {
  const id = "pie-interactive"
  
  const data = React.useMemo(() => [
    { name: "jobsCreated", value: jobsCreated, fill: chartConfig.jobsCreated.color },
    { name: "jobsApplied", value: jobsApplied, fill: chartConfig.jobsApplied.color },
    { name: "jobsSelected", value: jobsSelected, fill: chartConfig.jobsSelected.color },
    { name: "jobsRejected", value: jobsRejected, fill: chartConfig.jobsRejected.color },
  ], [jobsCreated, jobsApplied, jobsSelected, jobsRejected])

  const [tip, settip] = React.useState("Analysing your profile...")

  const [activeIndex, setActiveIndex] = React.useState(0)
  const activeItem = data[activeIndex]

  React.useEffect(() => {
    const getTip = async () => {
        const res = await aiAnalysis(jobsCreated,jobsApplied,jobsSelected,jobsRejected)
        settip(res)
    }

    getTip()
  }, [])


  return (
    <Card data-chart={id} className="flex flex-col w-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Personalised Tip: </CardTitle>
          <CardDescription>{tip}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeItem.value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartConfig[activeItem.name]?.label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}