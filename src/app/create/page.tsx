import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { CreateForm } from '@/components/create/create-form'
import { SiteHeader } from '@/components/dashboard/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('diagrammr-auth')
  
  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/login')
  }
}

export default async function CreatePage() {
  await checkAuth()

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
        <SiteHeader title="Create New Diagram" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <CreateForm />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}