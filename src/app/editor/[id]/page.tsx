import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EditorPageClient } from './editor-page-client'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('diagrammr-auth')

  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/login')
  }
}

export default async function EditorPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await checkAuth()
  const { id } = await params

  return <EditorPageClient id={id} />
}