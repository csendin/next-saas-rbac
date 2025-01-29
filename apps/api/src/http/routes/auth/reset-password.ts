import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function resetPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/password/reset',
        {
            schema: {
                tags: ['auth'],
                summary: `Reset the user's password`,
                body: z.object({
                    code: z.string(),
                    password: z.string().min(6),
                }),
                response: {
                    204: z.null(),
                },
            },
        },
        async (request, reply) => {
            const { code, password } = request.body

            const token = await prisma.token.findUnique({
                where: { id: code },
            })

            if (!token) {
                throw new UnauthorizedError()
            }

            const hashedPassword = await hash(password, 6)

            await prisma.$transaction([
                prisma.user.update({
                    where: { id: token.userId },
                    data: { password: hashedPassword },
                }),
                prisma.token.delete({
                    where: { id: code },
                }),
            ])

            return reply.status(204).send()
        }
    )
}
