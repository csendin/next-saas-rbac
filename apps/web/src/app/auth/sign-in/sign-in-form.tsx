'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
    const [{ errors, message, success }, handleSubmit, isPending] = useFormState(signInWithEmailAndPassword)

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Sign in failed!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input name="email" id="email" type="email" placeholder="m@example.com" />

                {errors?.email && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
                )}
            </div>

            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                    </Link>
                </div>
                <Input name="password" id="password" type="password" />

                {errors?.password && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sign in with e-mail'}
            </Button>

            <Button variant="link" className="w-full" size="sm" asChild>
                <Link href="/auth/sign-up">Create new account</Link>
            </Button>

            <Separator />

            <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                    />
                </svg>
                Sign in with GitHub
            </Button>
        </form>
    )
}
