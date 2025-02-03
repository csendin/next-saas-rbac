import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/auth/get-profile'

export async function isAuthenticated() {
    return !!(await cookies()).get('token')?.value
}

export async function auth() {
    const cookieStore = await cookies()

    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect('/auth/sign-in')
    }

    try {
        const { user } = await getProfile()

        return { user }
    } catch {}

    redirect('/api/auth/sign-out')
}
