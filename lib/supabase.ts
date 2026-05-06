import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are available
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

export type Branch = {
  id: string
  name: string
  monthly_revenue: number
  open_inquiries: number
  staff_count: number
  performance_score: number
  created_at: string
  updated_at: string
}

export type AuthUser = {
  id: string
  email: string
  created_at: string
}
