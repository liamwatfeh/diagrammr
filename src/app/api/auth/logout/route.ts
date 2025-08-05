import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear the authentication cookie
    const cookieStore = await cookies()
    cookieStore.delete('diagrammr-auth')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}