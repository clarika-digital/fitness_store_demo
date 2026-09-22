'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Check, Copy } from 'lucide-react'
import { subscribeNewsletter } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Newsletter() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [subscribedCode, setSubscribedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const mutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: (res) => {
      setSubscribedCode(res.code ?? 'WELCOME10')
      setApiError(null)
      toast({
        title: 'Welcome aboard!',
        description: 'Your 10% welcome code is ready below.',
      })
    },
    onError: (err: Error) => {
      const message = err.message || 'Something went wrong. Please try again.'
      setApiError(message)
      toast({
        title: 'Subscription failed',
        description: message,
        variant: 'destructive',
      })
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setValidationError('Please enter your email address.')
      return
    }
    if (!EMAIL_RE.test(value)) {
      setValidationError('That doesn’t look like a valid email address.')
      return
    }
    setValidationError(null)
    mutation.mutate(value)
  }

  const copyCode = async () => {
    if (!subscribedCode) return
    try {
      await navigator.clipboard.writeText(subscribedCode)
      setCopied(true)
      toast({
        title: 'Code copied',
        description: `${subscribedCode} is on your clipboard.`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the code manually.',
        variant: 'destructive',
      })
    }
  }

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center shadow-sm sm:p-10">
          {subscribedCode ? (
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check size={22} aria-hidden />
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900">
                You’re in — the code is yours.
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Enter this code at checkout to claim 10% off your first order.
              </p>
              <div className="mt-5 flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-white px-4 py-3">
                <span className="font-mono text-lg font-bold tracking-[0.2em] text-zinc-900">
                  {subscribedCode}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 gap-1.5 border-zinc-300"
                  onClick={copyCode}
                  aria-label={`Copy discount code ${subscribedCode}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                Get 10% off your first order
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                Flavor drops, restock alerts and training fuel tips. No spam.
              </p>
              <form
                onSubmit={submit}
                noValidate
                className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  aria-invalid={Boolean(validationError)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 flex-1 rounded-lg border-zinc-300 bg-white sm:max-w-xs"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-7 text-sm font-bold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Claiming…' : 'Claim 10%'}
                </Button>
              </form>
              {validationError && (
                <p role="alert" className="mt-3 text-xs font-medium text-destructive">
                  {validationError}
                </p>
              )}
              {apiError && (
                <p role="alert" className="mt-3 text-xs font-medium text-destructive">
                  {apiError}
                </p>
              )}
              <p className="mt-4 text-[11px] text-zinc-400">
                One email per week, max. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
