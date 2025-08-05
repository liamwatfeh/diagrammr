import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { ProcessingStatusCheck } from '@/components/processing/processing-status-check'
import { SiteHeader } from '@/components/dashboard/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('diagrammr-auth')

  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/login')
  }
}

export default async function ProcessingPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  await checkAuth()
  const { id } = await params

  return (
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
        <SiteHeader title="Processing Diagram" />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <ProcessingStatusCheck diagramId={id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}