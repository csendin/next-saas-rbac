import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/users',
        {
            schema: {
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(6),
                    avatarUrl: z.string().url().nullable(),
                }),
            },
        },
        (request, reply) => {
            const { name, email, password, avatarUrl } = request.body
        }
    )
}
