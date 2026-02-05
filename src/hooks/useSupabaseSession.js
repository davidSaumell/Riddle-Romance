"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function useSupabaseSession() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setUser(session.user)
      else setUser(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user }
}
