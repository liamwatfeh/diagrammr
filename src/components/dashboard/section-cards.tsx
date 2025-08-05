import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Diagrams</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <div className="ml-auto">
            <Badge variant="outline" className="gap-1">
              <ArrowTrendingUpIcon className="h-3 w-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <ArrowTrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Created in the last 30 days
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Client Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8
          </CardTitle>
          <div className="ml-auto">
            <Badge variant="outline" className="gap-1">
              <ArrowTrendingDownIcon className="h-3 w-3" />
              -5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New clients this quarter <ArrowTrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Active client engagements
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recent Exports</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            156
          </CardTitle>
          <div className="ml-auto">
            <Badge variant="outline" className="gap-1">
              <ArrowTrendingUpIcon className="h-3 w-3" />
              +24%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong export activity <ArrowTrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Presentation files generated</div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Success Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            92%
          </CardTitle>
          <div className="ml-auto">
            <Badge variant="outline" className="gap-1">
              <ArrowTrendingUpIcon className="h-3 w-3" />
              +3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High quality diagrams <ArrowTrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Client satisfaction rate</div>
        </CardFooter>
      </Card>
    </div>
  )
}