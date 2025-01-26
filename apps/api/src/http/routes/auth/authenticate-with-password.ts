import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
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
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body

            const user = await prisma.user.findUnique({
                where: { email },
            })

            if (!user) {
                throw new BadRequestError('Invalid credentials.')
            }

            if (user.password === null) {
                throw new BadRequestError('User does not have a password, use social login.')
            }

            const isPasswordValid = await compare(password, user.password)

            if (!isPasswordValid) {
                throw new BadRequestError('Invalid credentials.')
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
