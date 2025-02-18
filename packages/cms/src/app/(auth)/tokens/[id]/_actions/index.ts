'use server'

import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { actionClient } from '~/lib/safe-action'
import { insertTokenSchema, tokenIdSchema, updateTokenSchema } from './schemas'

export const insertToken = actionClient
  .schema(insertTokenSchema)
  .action(async ({ parsedInput }) => {
    revalidatePath('/', 'layout')
    const { relations, meta, managingEntities, ...data } = parsedInput
    return await db.transaction(async () => {
      try {
        const { id } = await db.token.insert(data)
        await db.tokenBridge.upsertMany(
          relations.map((relation) => {
            if ('sourceTokenId' in relation) {
              return {
                ...relation,
                targetTokenId: id,
              }
            }
            return {
              ...relation,
              sourceTokenId: id,
            }
          }),
        )
        await db.tokenMeta.upsertMany(
          meta
            .map((m) => ({
              ...m,
              tokenId: id,
            }))
            .filter(
              (m) =>
                m.source === 'Aggregate' ||
                m.source === 'Overrides' ||
                m.externalId,
            ),
        )
        await db.entityToToken.upsertManyOfTokenId(
          managingEntities.map(({ entityId }) => ({
            tokenId: id,
            entityId,
          })),
        )
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to insert token: ${e as string}` }
      }
    })
  })

export const updateToken = actionClient
  .schema(updateTokenSchema)
  .action(async ({ parsedInput }) => {
    const { id, relations, meta, managingEntities, ...data } = parsedInput
    revalidatePath('/', 'layout')
    return await db.transaction(async () => {
      try {
        await db.token.update(id, data)
        await db.tokenBridge.deleteByTokenId(id)
        await db.tokenBridge.upsertMany(
          relations.map((relation) => {
            if ('sourceTokenId' in relation) {
              return {
                ...relation,
                targetTokenId: id,
              }
            }
            return {
              ...relation,
              sourceTokenId: id,
            }
          }),
        )
        await db.tokenMeta.deleteByTokenId(id)
        await db.tokenMeta.upsertMany(
          meta
            .map((m) => ({
              ...m,
              tokenId: id,
            }))
            .filter(
              (m) =>
                m.source === 'Aggregate' ||
                m.source === 'Overrides' ||
                m.externalId,
            ),
        )
        await db.entityToToken.deleteByTokenId(id)
        await db.entityToToken.upsertManyOfTokenId(
          managingEntities.map(({ entityId }) => ({
            tokenId: id,
            entityId,
          })),
        )
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to update token: ${e as string}` }
      }
    })
  })

export const deleteToken = actionClient
  .schema(tokenIdSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput
    revalidatePath('/', 'layout')
    return await db.transaction(async () => {
      try {
        await db.entityToToken.deleteByTokenId(id)
        await db.tokenBridge.deleteByTokenId(id)
        await db.tokenMeta.deleteByTokenId(id)
        await db.token.delete(id)
        return { success: { id } }
      } catch (e) {
        return { failure: `Failed to delete token: ${e as string}` }
      }
    })
  })
