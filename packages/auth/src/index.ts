import { z } from 'zod'

import { AbilityBuilder, CreateAbility, MongoAbility, createMongoAbility } from '@casl/ability'

import { User } from './models/user'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organization'
import { projectSubject } from './subjects/project'
import { userSubject } from './subjects/user'

const appAbilitiesSchema = z.union([
    userSubject,
    projectSubject,
    organizationSubject,
    inviteSubject,
    billingSubject,

    z.tuple([z.literal('mange'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
    const builder = new AbilityBuilder(createAppAbility)

    if (typeof permissions[user.role] !== 'function') {
        throw new Error(`Permissions for role ${user.role} not found.`)
    }

    permissions[user.role](user, builder)

    const ability = builder.build()

    return ability
}
