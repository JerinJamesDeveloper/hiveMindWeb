'use client';

import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

export function EnergyUsage() {
  const chartData = [{ month: 'june', kwh: 128, fill: 'hsl(var(--primary))' }];
  const maxKwh = 500; // Monthly goal or average
  const percentage = (chartData[0].kwh / maxKwh) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Energy Usage - This Month</CardTitle>
        <CardDescription>June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            kwh: {
              label: 'kWh',
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius="80%"
            outerRadius="110%"
          >
            <PolarAngleAxis type="number" domain={[0, maxKwh]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="kwh" background cornerRadius={10} />
            <g className="transform-gpu">
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-5xl font-bold">
                {chartData[0].kwh}
              </text>
              <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-lg">
                kWh
              </text>
            </g>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          You've used {percentage.toFixed(0)}% of your typical monthly budget of {maxKwh} kWh.
        </div>
      </CardFooter>
    </Card>
  );
}
