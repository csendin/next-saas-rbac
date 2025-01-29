import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    return (
        <form action="" className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
            </div>

            <Button type="submit" className="w-full">
                Recover password
            </Button>

            <Button variant="link" className="w-full" size="sm" asChild>
                <Link href="/auth/sign-in">Sign in instead</Link>
            </Button>
        </form>
    )
}
