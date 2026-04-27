import { useState } from 'preact/hooks'
import { useLocation } from 'preact-iso'

type LoginStep = 'email' | 'sent'

export function Login() {
  const { route } = useLocation()
  const [step, setStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Replace with: supabase.auth.signInWithOtp({ email })
    setTimeout(() => {
      setLoading(false)
      setStep('sent')
    }, 900)
  }

  function handleBack() {
    setStep('email')
    setLoading(false)
  }

  return (
    <div class="auth">
      <div class="auth__panel">
        <div class="auth__panel-inner">
          <div class="auth__panel-logo">
            <span class="auth__panel-logomark">✦</span>
            <span class="auth__panel-logotext">Pastoralia</span>
          </div>
          <p class="auth__panel-tagline">
            Caring well<br />for those in<br />your charge.
          </p>
          <span class="auth__panel-deco" aria-hidden="true">✦</span>
        </div>
      </div>

      <div class="auth__stage">
        <div class="auth__card">
          {step === 'email' ? (
            <EmailStep
              email={email}
              loading={loading}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          ) : (
            <SentStep email={email} onBack={handleBack} onLogin={() => route('/dashboard')} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Email step ───────────────────────────────────────────

interface EmailStepProps {
  email: string
  loading: boolean
  onEmailChange: (v: string) => void
  onSubmit: (e: Event) => void
}

function EmailStep({ email, loading, onEmailChange, onSubmit }: EmailStepProps) {
  return (
    <>
      <div class="auth__intro">
        <h1 class="auth__heading">Welcome back</h1>
        <p class="auth__sub">Enter your email to receive a sign-in link.</p>
      </div>

      <form class="auth__form" onSubmit={onSubmit}>
        <div class="auth__field">
          <label class="auth__label" for="auth-email">Email address</label>
          <input
            id="auth-email"
            class="auth__input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onInput={(e) => onEmailChange((e.target as HTMLInputElement).value)}
            required
            autoComplete="email"
          />
        </div>
        <button class="auth__submit" type="submit" disabled={loading}>
          {loading && <span class="auth__spinner" aria-hidden="true" />}
          {loading ? 'Sending…' : 'Send sign-in link'}
        </button>
      </form>

      <div class="auth__divider"><span>or</span></div>

      <button class="auth__oauth-btn" type="button" disabled aria-disabled="true">
        <IconGoogle />
        <span>Continue with Google</span>
        <span class="auth__oauth-badge">Soon</span>
      </button>

      <p class="auth__note">
        This app is for authorised staff only. There is no self-registration — contact your administrator to request access.
      </p>
    </>
  )
}

// ── Sent step ────────────────────────────────────────────

interface SentStepProps {
  email: string
  onBack: () => void
  onLogin: () => void
}

function SentStep({ email, onBack, onLogin }: SentStepProps) {
  return (
    <div class="auth__sent">
      <div class="auth__sent-icon"><IconEnvelope /></div>
      <div class="auth__intro" style="text-align:center">
        <h1 class="auth__heading">Check your inbox</h1>
        <p class="auth__sub">
          We sent a sign-in link to<br />
          <strong class="auth__sent-email">{email}</strong>
        </p>
      </div>
      <p class="auth__note">
        The link expires in 10 minutes. Check your spam folder if you don't see it.
      </p>
      <button class="auth__submit" type="button" onClick={onLogin}>
        Open dashboard →
      </button>
      <button class="auth__back" type="button" onClick={onBack}>
        ← Use a different email
      </button>
    </div>
  )
}

// ── Icons ────────────────────────────────────────────────

function IconGoogle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.31a3.68 3.68 0 01-1.6 2.42v2h2.58c1.51-1.39 2.39-3.44 2.39-5.88z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2a4.8 4.8 0 01-7.15-2.52H.98v2.07A8 8 0 008 16z"
        fill="#34A853"
      />
      <path
        d="M3.57 9.54A4.8 4.8 0 013.32 8c0-.54.09-1.06.25-1.54V4.39H.98A8 8 0 000 8c0 1.29.31 2.5.98 3.61l2.59-2.07z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.18c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 00.98 4.39L3.57 6.46A4.8 4.8 0 018 3.18z"
        fill="#EA4335"
      />
    </svg>
  )
}

function IconEnvelope() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2.5" y="6" width="23" height="16" rx="2.5" stroke="var(--amber)" strokeWidth="1.75" />
      <path d="M2.5 9.5l11.5 8 11.5-8" stroke="var(--amber)" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}
