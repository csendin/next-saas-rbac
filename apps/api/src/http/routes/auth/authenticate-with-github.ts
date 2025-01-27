import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'

export async function authenticateWithGithub(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/github',
        {
            schema: {
                tags: ['auth'],
                summary: 'Authenticate with GitHub',
                body: z.object({
                    code: z.string(),
                }),
                response: {
                    201: z.object({
                        token: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { code } = request.body

            const url = new URL('https://github.com/login/oauth/access_token')

            url.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
            url.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET)
            url.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI)
            url.searchParams.set('code', code)

            const accessToken = await fetch(url, {
                method: 'POST',
                headers: { Accept: 'application/json' },
            })

            const data = await accessToken.json()

            const schema = z.object({
                access_token: z.string(),
                token_type: z.literal('bearer'),
                scope: z.string(),
            })

            const { access_token } = schema.parse(data)

            const userUrl = await fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${access_token}` },
            })

            const userData = await userUrl.json()

            const userSchema = z.object({
                id: z.number().int().transform(String),
                avatar_url: z.string().url(),
                name: z.string().nullable(),
                email: z.string().nullable(),
            })

            const { id: githubId, name, email, avatar_url } = userSchema.parse(userData)

            if (email === null) {
                throw new BadRequestError('Your GitHub account must have an email to authenticate.')
            }

            let user = await prisma.user.findUnique({
                where: { email },
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        avatarUrl: avatar_url,
                    },
                })
            }

            let account = await prisma.account.findUnique({
                where: {
                    provider_userId: {
                        provider: 'GITHUB',
                        userId: user.id,
                    },
                },
            })

            if (!account) {
                account = await prisma.account.create({
                    data: {
                        provider: 'GITHUB',
                        providerAccountId: githubId,
                        userId: user.id,
                    },
                })
            }

            const token = await reply.jwtSign(
                {
                    sub: user.id,
                },
                {
                    sign: {
                        expiresIn: '7d',
                    },
                }
            )

            return reply.status(201).send({ token })
        }
    )
}
