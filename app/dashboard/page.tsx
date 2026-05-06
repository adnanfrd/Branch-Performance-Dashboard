'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Branch, getSupabaseClient } from '@/lib/supabase'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { BranchesTable } from '@/components/dashboard/branches-table'

export default function DashboardPage() {
  const router = useRouter()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString())
  const [refreshing, setRefreshing] = useState(false)
  const [liveStatus, setLiveStatus] = useState('Connecting to live updates')

  const fetchBranches = useCallback(async (background = false) => {
    try {
      if (background) {
        setRefreshing(true)
      }

      setError('')
      const response = await fetch('/api/branches', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch branches')
      }

      const data = await response.json()
      setBranches(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError('Unable to load branch data. Please check your Supabase configuration.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [router])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined

    try {
      const channel = getSupabaseClient()
        .channel('branches-dashboard')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'branches' },
          () => {
            fetchBranches(true)
          },
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setLiveStatus('Live updates enabled')
          }

          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setLiveStatus('Refreshing every 30 seconds')
          }
        })

      intervalId = setInterval(() => {
        fetchBranches(true)
      }, 30000)

      return () => {
        channel.unsubscribe()
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    } catch (err) {
      setLiveStatus('Refreshing every 30 seconds')
      intervalId = setInterval(() => {
        fetchBranches(true)
      }, 30000)

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    }
  }, [fetchBranches])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Branch Performance Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time metrics across all locations
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            <p className="font-medium">Configuration Required</p>
            <p className="mt-1">{error}</p>
            <p className="mt-3 text-xs opacity-75">
              Please set up your Supabase database with:
            </p>
            <ul className="mt-2 text-xs opacity-75 list-disc list-inside space-y-1">
              <li>
                <code className="bg-secondary/30 px-1 py-0.5 rounded">branches</code> table with the required fields
              </li>
              <li>Supabase Auth users for sign-in</li>
              <li>Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to environment variables</li>
            </ul>
          </div>
        )}

        {loading && !error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
              <p className="text-muted-foreground">Loading branch data...</p>
            </div>
          </div>
        ) : branches.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <p>Last updated: {lastUpdated}</p>
                <p className="flex items-center gap-1.5">
                  {liveStatus === 'Live updates enabled' ? (
                    <Wifi className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  )}
                  {liveStatus}
                  {refreshing ? '...' : ''}
                </p>
              </div>
              <Button
                onClick={() => fetchBranches(true)}
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-secondary"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                Refresh Data
              </Button>
            </div>

            <SummaryCards branches={branches} />
            <BranchesTable branches={branches} />
          </>
        ) : (
          !error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No branch data available</p>
                <Button
                  onClick={() => fetchBranches(true)}
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Try Again
                </Button>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  )
}
