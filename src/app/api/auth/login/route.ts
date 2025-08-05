import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get the password from environment variables
    const envPassword = process.env.PASSWORD

    if (!envPassword) {
      console.error('PASSWORD environment variable is not set')
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Compare the provided password with the environment variable
    if (password !== envPassword) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      )
    }

    // Set a simple session cookie
    const cookieStore = await cookies()
    cookieStore.set('diagrammr-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}