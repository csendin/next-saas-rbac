'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithGitHub } from '../actions'
import { signUpAction } from './actions'

export function SignUpForm() {
    const router = useRouter()
    const [{ errors, message, success }, handleSubmit, isPending] = useFormState(signUpAction, () => {
        router.push('/auth/sign-in')
    })
    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {success === false && message && (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>Sign up failed!</AlertTitle>
                        <AlertDescription>
                            <p>{message}</p>
                        </AlertDescription>
                    </Alert>
                )}
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" id="name" />
                    {errors?.name && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input name="email" type="email" id="email" />
                    {errors?.email && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" id="password" />
                    {errors?.password && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password_confirmation">Confirm your password</Label>
                    <Input name="password_confirmation" type="password" id="password_confirmation" />
                    {errors?.password_confirmation && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">
                            {errors.password_confirmation[0]}
                        </p>
                    )}
                </div>
                <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Create account'}
                </Button>
                <Button className="w-full" variant="link" size="sm" asChild>
                    <Link href="/auth/sign-in">Already registered? Sign In</Link>
                </Button>
            </form>
            <Separator />
            <form action={signInWithGitHub}>
                <Button type="submit" className="w-full" variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>
                    Sign up with GitHub
                </Button>
            </form>
        </div>
    )
}
