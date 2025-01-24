import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/profile',
        {
            schema: {
                tags: ['auth'],
                summary: 'Get authenticated user profile',
                response: {
                    200: z.object({
                        user: z.object({
                            id: z.string().uuid(),
                            name: z.string().nullable(),
                            email: z.string().email(),
                            avatarUrl: z.string().url().nullable(),
                        }),
                    }),
                    400: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { sub: userId } = await request.jwtVerify<{ sub: string }>()

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                },
            })

            if (!user) {
                return reply.status(400).send({ message: 'User not found.' })
            }

            return reply.status(200).send({ user })
        }
    )
}
