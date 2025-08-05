"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SparklesIcon, CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ProcessingStatus {
  status: 'processing' | 'ready' | 'error'
  message?: string
  elementCount?: number
  error?: string
}

export function ProcessingStatusCheck({ diagramId }: { diagramId: string }) {
  const [status, setStatus] = useState<ProcessingStatus>({ status: 'processing' })
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout
    let timeInterval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/diagrams/${diagramId}/status`)
        const data = await response.json()
        
        setStatus(data)
        
        if (data.status === 'ready') {
          setProgress(100)
          clearInterval(interval)
          clearInterval(progressInterval)
          clearInterval(timeInterval)
          
          // Wait a moment to show completion, then redirect
          setTimeout(() => {
            router.push(`/editor/${diagramId}`)
          }, 2000)
        }
      } catch (error) {
        console.error('Status check failed:', error)
        setStatus({
          status: 'error',
          error: 'Failed to check processing status'
        })
        clearInterval(interval)
        clearInterval(progressInterval)
        clearInterval(timeInterval)
      }
    }

    // Check status every 2 seconds
    interval = setInterval(checkStatus, 2000)
    
    // Update progress gradually
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + Math.random() * 10
        return prev
      })
    }, 500)
    
    // Update time elapsed
    timeInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    // Initial check
    checkStatus()

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval) 
      clearInterval(timeInterval)
    }
  }, [diagramId, router])

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    router.push('/create')
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Main Status Card */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {status.status === 'processing' && (
              <div className="relative">
                <SparklesIcon className="h-12 w-12 text-primary animate-pulse" />
                <div className="absolute inset-0 animate-spin">
                  <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
                </div>
              </div>
            )}
            {status.status === 'ready' && (
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status.status === 'error' && (
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <XMarkIcon className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status.status === 'processing' && 'Generating Your Diagram'}
            {status.status === 'ready' && 'Diagram Ready!'}
            {status.status === 'error' && 'Processing Error'}
          </CardTitle>
          
          <CardDescription>
            {status.status === 'processing' && 'AI is analyzing your transcript and creating diagram elements...'}
            {status.status === 'ready' && 'Your professional diagram has been generated successfully'}
            {status.status === 'error' && 'Something went wrong during processing'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          {status.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {/* Status Message */}
          {status.message && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{status.message}</p>
            </div>
          )}
          
          {/* Element Count (when ready) */}
          {status.status === 'ready' && status.elementCount && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm">
                {status.elementCount} diagram elements created
              </Badge>
            </div>
          )}
          
          {/* Error Message */}
          {status.status === 'error' && status.error && (
            <div className="text-center space-y-4">
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                {status.error}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Try Again
                </Button>
                <Button onClick={handleGoBack} variant="ghost" size="sm">
                  Go Back
                </Button>
              </div>
            </div>
          )}
          
          {/* Time Elapsed */}
          {status.status === 'processing' && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              <span>Time elapsed: {formatTime(timeElapsed)}</span>
            </div>
          )}
          
          {/* Success Actions */}
          {status.status === 'ready' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to diagram editor...
              </p>
              <div className="animate-pulse">
                <div className="h-1 bg-primary rounded-full"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Technical Details Card (Processing Only) */}
      {status.status === 'processing' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's Happening?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Analyzing technical conversation transcript</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Identifying systems, processes, and data flows</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Generating professional diagram elements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Creating logical connections and layout</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}