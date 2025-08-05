"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import TextareaAutosize from "react-textarea-autosize"
import { SparklesIcon, ClockIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Form validation schema
const createDiagramSchema = z.object({
  clientName: z.string().min(1, "Client/project name is required").max(100, "Client name too long (100 characters max)"),
  projectTitle: z.string().min(1, "Project title is required").max(255, "Project title too long (255 characters max)"),
  transcript: z.string()
    .min(100, "Transcript too short (minimum 100 characters for quality diagrams)")
    .max(50000, "Transcript too long (50,000 characters max)"),
  notes: z.string().max(1000, "Notes too long (1,000 characters max)").optional()
})

type CreateDiagramForm = z.infer<typeof createDiagramSchema>

export function CreateForm() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentAnalysis, setContentAnalysis] = useState<{
    isTechnical: boolean
    confidence: number
    suggestions: string[]
  } | null>(null)
  const [suggestedTitle, setSuggestedTitle] = useState<string>("")

  const form = useForm<CreateDiagramForm>({
    resolver: zodResolver(createDiagramSchema),
    defaultValues: {
      clientName: "",
      projectTitle: "",
      transcript: "",
      notes: "",
    },
    mode: "onChange" // Real-time validation
  })

  const { watch, setValue } = form
  const watchedFields = watch()
  
  // Calculate character counts
  const transcriptLength = watchedFields.transcript?.length || 0
  const projectTitleLength = watchedFields.projectTitle?.length || 0
  const clientNameLength = watchedFields.clientName?.length || 0
  const notesLength = watchedFields.notes?.length || 0

  // Check if form is valid for submission
  const isFormValid = form.formState.isValid && !isProcessing

  // Analyze transcript content when it changes
  React.useEffect(() => {
    if (transcriptLength > 200) {
      // Simple content analysis
      const transcript = watchedFields.transcript?.toLowerCase() || ""
      const technicalTerms = [
        'api', 'database', 'server', 'authentication', 'authorization', 'endpoint',
        'integration', 'workflow', 'system', 'architecture', 'microservice',
        'payload', 'response', 'request', 'json', 'xml', 'sql', 'nosql',
        'oauth', 'jwt', 'token', 'encryption', 'ssl', 'https', 'websocket'
      ]
      
      const foundTerms = technicalTerms.filter(term => transcript.includes(term))
      const isTechnical = foundTerms.length >= 3
      const confidence = Math.min(foundTerms.length / 5, 1)

      setContentAnalysis({
        isTechnical,
        confidence,
        suggestions: isTechnical 
          ? ["Great technical content detected!", "Perfect for diagram generation"]
          : ["Consider adding more technical details", "Include API endpoints, database operations, or system integrations"]
      })

      // Generate AI-powered title suggestion (mock for now)
      if (isTechnical && !suggestedTitle && watchedFields.clientName) {
        const systems = foundTerms.slice(0, 2).join(" & ")
        setSuggestedTitle(`${watchedFields.clientName} ${systems.charAt(0).toUpperCase() + systems.slice(1)} Architecture`)
      }
    }
  }, [transcriptLength, watchedFields.transcript, watchedFields.clientName, suggestedTitle])

  const onSubmit = async (data: CreateDiagramForm) => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/diagrams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}. Please check the console for details.`)
      }
      
      if (!response.ok) {
        const errorMessage = result.error || 'Failed to create diagram'
        const hint = result.hint ? `\n\nHint: ${result.hint}` : ''
        throw new Error(`${errorMessage}${hint}`)
      }
      
      if (result.success) {
        // Store AI response in session storage for the diagram viewer
        if (result.aiResponse) {
          sessionStorage.setItem(`diagram_${result.diagramId}_ai_response`, JSON.stringify(result.aiResponse))
          console.log('💾 Stored AI response in session storage for diagram:', result.diagramId)
        }
        
        // Navigate to processing page with diagram ID
        router.push(`/processing/${result.diagramId}`)
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
      
    } catch (error) {
      console.error("Failed to create diagram:", error)
      // Show error to user (you could add a toast notification here)
      alert(`Error: ${error.message}`)
      setIsProcessing(false)
    }
  }

  const useSuggestedTitle = () => {
    setValue("projectTitle", suggestedTitle)
    setSuggestedTitle("")
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SparklesIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Create New Diagram</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Transform technical conversations into professional flowcharts
        </p>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Project Setup
          </CardTitle>
          <CardDescription>
            Provide your technical conversation details to generate a branded diagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Client/Project Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client/Project Name</Label>
              <Input
                id="clientName"
                placeholder="e.g., ABC Corp E-commerce Flow"
                {...form.register("clientName")}
                className={form.formState.errors.clientName ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-sm">
                <span className="text-destructive">
                  {form.formState.errors.clientName?.message}
                </span>
                <span className="text-muted-foreground">
                  {clientNameLength}/100 characters
                </span>
              </div>
            </div>

            {/* Project Title */}
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                placeholder="e.g., Payment Processing Architecture"
                {...form.register("projectTitle")}
                className={form.formState.errors.projectTitle ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-sm">
                <span className="text-destructive">
                  {form.formState.errors.projectTitle?.message}
                </span>
                <span className="text-muted-foreground">
                  {projectTitleLength}/255 characters
                </span>
              </div>
              
              {/* AI Title Suggestion */}
              {suggestedTitle && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        AI Suggestion:
                      </span>
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        "{suggestedTitle}"
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={useSuggestedTitle}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      Use Suggestion
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Transcript Input */}
            <div className="space-y-2">
              <Label htmlFor="transcript">Technical Conversation Transcript</Label>
              <div className="relative">
                <TextareaAutosize
                  id="transcript"
                  placeholder="Paste your technical conversation transcript here...

Example:
- Discussion of API endpoints and data flow
- Database schema requirements
- System integration points
- Authentication and security considerations"
                  minRows={8}
                  maxRows={20}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  {...form.register("transcript")}
                />
                
                {/* Character Count & Status */}
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  {contentAnalysis && (
                    <Badge 
                      variant={contentAnalysis.isTechnical ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {contentAnalysis.isTechnical ? (
                        <><CheckIcon className="h-3 w-3 mr-1" />Technical</>
                      ) : (
                        <><ExclamationTriangleIcon className="h-3 w-3 mr-1" />Needs Technical Details</>
                      )}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                    {transcriptLength.toLocaleString()} chars
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-destructive">
                  {form.formState.errors.transcript?.message}
                </span>
                <span className="text-muted-foreground">
                  Min 100 • Max 50,000 characters
                </span>
              </div>

              {/* Content Analysis Feedback */}
              {contentAnalysis && (
                <div className={`p-3 rounded-lg border ${
                  contentAnalysis.isTechnical 
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                }`}>
                  <div className="space-y-2">
                    {contentAnalysis.suggestions.map((suggestion, index) => (
                      <p key={index} className={`text-sm ${
                        contentAnalysis.isTechnical 
                          ? "text-green-700 dark:text-green-300"
                          : "text-yellow-700 dark:text-yellow-300"
                      }`}>
                        {suggestion}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <TextareaAutosize
                id="notes"
                placeholder="Meeting context, special requirements, or additional details..."
                minRows={3}
                maxRows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                {...form.register("notes")}
              />
              <div className="flex justify-between text-sm">
                <span className="text-destructive">
                  {form.formState.errors.notes?.message}
                </span>
                <span className="text-muted-foreground">
                  {notesLength}/1,000 characters
                </span>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="h-4 w-4" />
                <span>Processing typically takes 30-60 seconds</span>
              </div>
              
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid}
                className="min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Generate Diagram
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Better Diagrams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Include Technical Details:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• API endpoints and responses</li>
                <li>• Database operations</li>
                <li>• System integrations</li>
                <li>• Authentication flows</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Best Results:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use specific system names</li>
                <li>• Mention data flow directions</li>
                <li>• Include error handling</li>
                <li>• Note dependencies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}