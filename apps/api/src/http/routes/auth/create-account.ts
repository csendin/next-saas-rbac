import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/users',
        {
            schema: {
                tags: ['auth'],
                summary: 'Create a new account',
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(6),
                    avatarUrl: z.string().url().nullable(),
                }),
            },
        },
        async (request, reply) => {
            const { name, email, password, avatarUrl } = request.body

            const userWithSameEmail = await prisma.user.findUnique({
                where: { email },
            })

            if (userWithSameEmail) {
                return reply.status(400).send({ message: 'User with same e-mail already exists.' })
            }

            const hashedPassword = await hash(password, 6)

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    avatarUrl,
                },
            })

            return reply.status(201).send()
        }
    )
}
