"use client"

import * as React from "react"
import {
  PencilIcon,
  EyeIcon,
  PresentationChartBarIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const diagramData = [
  {
    id: "1",
    title: "ABC Corp E-commerce Flow",
    client: "ABC Corp",
    status: "ready",
    lastModified: "2 hours ago",
    exports: 3,
  },
  {
    id: "2",
    title: "XYZ API Integration",
    client: "XYZ Inc",
    status: "draft",
    lastModified: "1 day ago",
    exports: 1,
  },
  {
    id: "3",
    title: "Payment Processing System",
    client: "ABC Corp",
    status: "ready",
    lastModified: "3 days ago",
    exports: 5,
  },
  {
    id: "4",
    title: "User Authentication Flow",
    client: "TechStart Ltd",
    status: "ready",
    lastModified: "1 week ago",
    exports: 2,
  },
  {
    id: "5",
    title: "Data Pipeline Architecture",
    client: "DataCorp",
    status: "draft",
    lastModified: "2 weeks ago",
    exports: 0,
  },
]

export function DataTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Diagrams</CardTitle>
        <CardDescription>
          Your latest diagram projects and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Diagram</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-center">Exports</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagramData.map((diagram) => (
                <TableRow key={diagram.id}>
                  <TableCell className="font-medium">
                    {diagram.title}
                  </TableCell>
                  <TableCell>{diagram.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant={diagram.status === "ready" ? "default" : "secondary"}
                    >
                      {diagram.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {diagram.lastModified}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{diagram.exports}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <EllipsisVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem>
                            <PresentationChartBarIcon className="h-4 w-4 mr-2" />
                            Present
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {diagramData.length} of {diagramData.length} diagrams
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}