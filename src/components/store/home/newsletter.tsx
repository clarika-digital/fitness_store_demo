'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { subscribeNewsletter } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { EMAIL_PATTERN, VALIDATION_MESSAGES, CHECKOUT_FIELD_PLACEHOLDERS } from '@/data/validation'
import { WELCOME_PROMO_CODE, COPY_FEEDBACK_MS } from '@/data/commerce'
import { NEWSLETTER_COPY } from '@/data/copy/home'
import { Icon } from '@/core/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
      setSubscribedCode(res.code ?? WELCOME_PROMO_CODE)
      setApiError(null)
      toast({
        title: NEWSLETTER_COPY.toast.successTitle,
        description: NEWSLETTER_COPY.toast.successBody,
      })
    },
    onError: (err: Error) => {
      const message = err.message || NEWSLETTER_COPY.toast.fallbackError
      setApiError(message)
      toast({
        title: NEWSLETTER_COPY.toast.errorTitle,
        description: message,
        variant: 'destructive',
      })
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setValidationError(VALIDATION_MESSAGES.emailEmpty)
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setValidationError(VALIDATION_MESSAGES.emailLooksWrong)
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
        title: NEWSLETTER_COPY.toast.copyTitle,
        description: NEWSLETTER_COPY.toast.copyBody(subscribedCode),
      })
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
    } catch {
      toast({
        title: NEWSLETTER_COPY.toast.copyErrorTitle,
        description: NEWSLETTER_COPY.toast.copyErrorBody,
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
                <Icon name="check" size={22} />
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900">
                {NEWSLETTER_COPY.successTitle}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">{NEWSLETTER_COPY.successBody}</p>
              <div className="mt-5 flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-white px-4 py-3">
                <span className="font-mono text-lg font-bold tracking-[0.2em] text-zinc-900">
                  {subscribedCode}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 gap-1.5 border-zinc-300"
                  onClick={copyCode}
                  aria-label={NEWSLETTER_COPY.copyAriaLabel(subscribedCode)}
                >
                  <Icon name={copied ? 'check' : 'copy'} size={14} />
                  {copied ? NEWSLETTER_COPY.copiedLabel : NEWSLETTER_COPY.copyLabel}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                {NEWSLETTER_COPY.title}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                {NEWSLETTER_COPY.subtitle}
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
                  placeholder={CHECKOUT_FIELD_PLACEHOLDERS.email}
                  aria-label={NEWSLETTER_COPY.emailAriaLabel}
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
                  {mutation.isPending
                    ? NEWSLETTER_COPY.pendingCta
                    : NEWSLETTER_COPY.cta}
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
              <p className="mt-4 text-[11px] text-zinc-400">{NEWSLETTER_COPY.finePrint}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
