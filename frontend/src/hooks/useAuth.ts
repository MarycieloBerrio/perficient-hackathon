import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

interface UseAuthReturn {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

/**
 * Custom hook to manage authentication state
 * @returns {UseAuthReturn} { user, loading, signOut }
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return { user, loading, signOut }
}
