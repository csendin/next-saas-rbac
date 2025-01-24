import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/password',
        {
            schema: {
                tags: ['auth'],
                summary: 'Authenticate with e-mail & password',
                body: z.object({
                    email: z.string().email(),
                    password: z.string(),
                }),
                response: {
                    201: z.object({
                        accessToken: z.string(),
                    }),
                    400: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body

            const user = await prisma.user.findUnique({
                where: { email },
            })

            if (!user) {
                return reply.status(400).send({ message: 'Invalid credentials.' })
            }

            if (user.password === null) {
                return reply.status(400).send({ message: 'User does not have a password, use social login.' })
            }

            const isPasswordValid = await compare(password, user.password)

            if (!isPasswordValid) {
                return reply.status(400).send({ message: 'Invalid credentials.' })
            }

            const accessToken = await reply.jwtSign(
                {
                    sub: user.id,
                },
                {
                    sign: {
                        expiresIn: '7d',
                    },
                }
            )

            return reply.status(201).send({ accessToken })
        }
    )
}
