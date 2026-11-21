import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDashboard from '../components/admin/AdminDashboard'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let mounted = true
    void client.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!mounted) return
      if (sessionError) setError(sessionError.message)
      if (data.session?.user) {
        try {
          const { data: record, error: adminError } = await client
            .from('admin_users')
            .select('user_id')
            .eq('user_id', data.session.user.id)
            .maybeSingle()
          if (adminError) throw adminError
          if (record) setUser(data.session.user)
          else {
            await client.auth.signOut()
            setError('This account is not on the admin allowlist.')
          }
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Could not verify admin access.')
        }
      }
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const client = supabase
    if (!client) return
    setBusy(true)
    setError('')
    try {
      const { data, error: signInError } = await client.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
      const { data: record, error: adminError } = await client
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()
      if (adminError) throw adminError
      if (!record) {
        await client.auth.signOut()
        throw new Error('This account is not on the admin allowlist.')
      }
      setUser(data.user)
      setPassword('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message)
      return
    }
    setUser(null)
  }

  if (!supabaseConfigured) {
    return (
      <main className="admin-page" id="main-content">
        <section className="admin-login-card">
          <p className="eyebrow">14MM / PRIVATE STUDIO</p>
          <h1>Connect your <em>archive.</em></h1>
          <p>To activate content management, add your Supabase project URL and publishable anon key to the local environment file, then apply the included database migration.</p>
          <ol>
            <li>Copy <code>.env.example</code> to <code>.env.local</code>.</li>
            <li>Fill in <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Run the SQL migration in <code>supabase/migrations</code> from Supabase SQL Editor.</li>
          </ol>
          <Link className="admin-back-link" to="/"><ArrowLeft size={15} /> Back to the portfolio</Link>
        </section>
      </main>
    )
  }

  if (loading) {
    return <main className="admin-page" id="main-content"><p className="admin-loading">Checking private studio access…</p></main>
  }

  if (user) return <AdminDashboard user={user} onSignOut={() => void signOut()} />

  return (
    <main className="admin-page" id="main-content">
      <section className="admin-login-card">
        <p className="eyebrow"><LockKeyhole size={13} /> PRIVATE STUDIO</p>
        <h1>Manage the <em>archive.</em></h1>
        <p>Sign in with an admin account that has been explicitly added to the allowlist.</p>
        <form className="admin-form" onSubmit={(event) => void signIn(event)}>
          <label className="admin-field"><span>Email</span><input autoComplete="username" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="admin-field"><span>Password</span><input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Sign in'} <LogIn size={15} /></button>
        </form>
        <Link className="admin-back-link" to="/"><ArrowLeft size={15} /> Back to the portfolio</Link>
      </section>
    </main>
  )
}
