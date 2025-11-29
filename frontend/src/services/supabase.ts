import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for authentication
interface SignUpCredentials {
    email: string
    password: string
}

interface SignInCredentials {
    email: string
    password: string
}

// Example: Authentication helpers
export const authService = {
    // Sign up a new user
    signUp: async ({ email, password }: SignUpCredentials) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    // Sign in an existing user
    signIn: async ({ email, password }: SignInCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Sign out the current user
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get the current user
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    // Listen to auth state changes
    onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) => {
        return supabase.auth.onAuthStateChange(callback)
    }
}
