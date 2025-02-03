'use server'

import { redirect } from 'next/navigation'

export async function signInWithGitHub() {
    const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

    githubSignInURL.searchParams.set('client_id', 'Ov23lis0nCnGDGqMAQ3h')
    githubSignInURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback')
    githubSignInURL.searchParams.set('scope', 'user')

    redirect(githubSignInURL.toString())
}
