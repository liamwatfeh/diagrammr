'use client'

import { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SiteHeader } from '@/components/dashboard/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DiagramViewer } from '@/components/editor/diagram-viewer'
import { 
  PencilIcon, 
  PresentationChartBarIcon, 
  ArrowDownTrayIcon,
  SparklesIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface EditorPageClientProps {
  id: string
}

export function EditorPageClient({ id }: EditorPageClientProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle escape key to close expanded mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  return (
    <>
      {/* Expanded Canvas Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {/* Expanded Canvas Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">Diagram Editor - Full Screen</h1>
                <Badge variant="secondary">Ready</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
            
            {/* Full Screen Canvas */}
            <div className="flex-1 bg-background">
              <DiagramViewer 
                diagramId={id}
                className="w-full h-full"
                readOnly={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Normal Page Layout */}
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title={`Diagram Editor: ${id}`} />
          <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">

            {/* Success Message */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-green-900 dark:text-green-100">
                      🎉 Diagram Generated Successfully!
                    </CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      Your AI-powered technical diagram is ready for editing and presentation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Diagram Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Sample E-commerce API System</CardTitle>
                    <CardDescription className="mt-2">
                      Generated from technical conversation transcript • 12 elements • 8 connections
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  {/* Interactive Canvas */}
                  <div className="h-96 bg-background rounded-lg border border-border overflow-hidden">
                    <DiagramViewer 
                      diagramId={id}
                      className="w-full h-full"
                      readOnly={false}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center gap-2"
                    >
                      <ArrowsPointingOutIcon className="h-4 w-4" />
                      Expand Editor
                    </Button>
                    <Button className="flex items-center gap-2">
                      <PencilIcon className="h-4 w-4" />
                      Edit Elements
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <PresentationChartBarIcon className="h-4 w-4" />
                      Present Mode
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  {/* Generated Elements Summary */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Generated Elements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>API Gateway</span>
                            <Badge variant="outline">System</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>User Authentication</span>
                            <Badge variant="outline">Process</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Validation</span>
                            <Badge variant="outline">Decision</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>PostgreSQL Database</span>
                            <Badge variant="outline">Data</Badge>
                          </div>
                          <div className="text-muted-foreground">
                            + 8 more elements...
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span>AI analysis complete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <span>Elements positioned automatically</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                            <span>Ready for manual refinement</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                            <span>Presentation mode available</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}