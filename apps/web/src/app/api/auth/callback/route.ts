import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signInWithGitHub } from '@/http/auth/sign-in-with-github'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.json({ message: 'GitHub OAuth code was not found.' }, { status: 400 })
    }

    const { token } = await signInWithGitHub({ code })

    const cookieStore = await cookies()

    cookieStore.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const redirectURL = request.nextUrl.clone()

    redirectURL.pathname = '/'
    redirectURL.search = ''

    return NextResponse.redirect(redirectURL)
}
