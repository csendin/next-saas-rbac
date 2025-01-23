import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()

    const password = await hash('123456', 1)

    const firstUser = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@acme.com',
            password,
            avatarUrl: 'https://github.com/csendin.png',
        },
    })

    const secondUser = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password,
            avatarUrl: faker.image.avatarGitHub(),
        },
    })

    const thirdUser = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password,
            avatarUrl: faker.image.avatarGitHub(),
        },
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Admin)',
            slug: 'acme-admin',
            domain: 'acme.com',
            attachUsersByDomain: true,
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: firstUser.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                    ],
                },
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: firstUser.id,
                            role: 'ADMIN',
                        },
                        {
                            userId: secondUser.id,
                            role: 'MEMBER',
                        },
                        {
                            userId: thirdUser.id,
                            role: 'MEMBER',
                        },
                    ],
                },
            },
        },
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Member)',
            slug: 'acme-member',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: firstUser.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                    ],
                },
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: firstUser.id,
                            role: 'MEMBER',
                        },
                        {
                            userId: secondUser.id,
                            role: 'ADMIN',
                        },
                        {
                            userId: thirdUser.id,
                            role: 'MEMBER',
                        },
                    ],
                },
            },
        },
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Billing)',
            slug: 'acme-billing',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: firstUser.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([firstUser.id, secondUser.id, thirdUser.id]),
                        },
                    ],
                },
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: firstUser.id,
                            role: 'BILLING',
                        },
                        {
                            userId: secondUser.id,
                            role: 'ADMIN',
                        },
                        {
                            userId: thirdUser.id,
                            role: 'MEMBER',
                        },
                    ],
                },
            },
        },
    })
}

seed().then(() => {
    console.log('Database seeded!')
})
