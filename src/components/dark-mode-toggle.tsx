'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = (checked: boolean) => {
    setIsDark(checked)
    if (checked) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">☀️</span>
      <Switch
        checked={isDark}
        onCheckedChange={toggleDarkMode}
        aria-label="Toggle dark mode"
      />
      <span className="text-sm text-muted-foreground">🌙</span>
    </div>
  )
}
