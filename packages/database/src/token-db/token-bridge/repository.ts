import { BaseRepository } from '../../BaseRepository'
import {
  TokenBridgeRecord,
  UpsertableTokenBridgeRecord,
  upsertableToRecord,
} from './entity'
import { selectTokenBridge } from './select'

export class TokenBridgeRepository extends BaseRepository {
  async getAll(): Promise<TokenBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('TokenBridge')
      .select(selectTokenBridge)
      .execute()
    return rows
  }

  async getByTargetTokenIds(
    targetTokenIds: string[],
  ): Promise<TokenBridgeRecord[]> {
    if (targetTokenIds.length === 0) return []

    const rows = await this.db
      .selectFrom('TokenBridge')
      .select(selectTokenBridge)
      .where('targetTokenId', 'in', targetTokenIds)
      .execute()
    return rows
  }

  async getByTokenId(tokenId: string): Promise<TokenBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('TokenBridge')
      .select(selectTokenBridge)
      .where((eb) =>
        eb('targetTokenId', '=', tokenId).or('sourceTokenId', '=', tokenId),
      )
      .execute()
    return rows
  }

  async getByExternalBridgeId(
    externalBridgeId: string,
  ): Promise<TokenBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('TokenBridge')
      .select(selectTokenBridge)
      .where('externalBridgeId', '=', externalBridgeId)
      .execute()
    return rows
  }

  async upsert(record: UpsertableTokenBridgeRecord): Promise<{ id: string }> {
    const row = upsertableToRecord(record)
    return await this.db
      .insertInto('TokenBridge')
      .values(row)
      .onConflict((cb) =>
        cb.column('targetTokenId').doUpdateSet((eb) => ({
          externalBridgeId: eb.ref('excluded.externalBridgeId'),
          sourceTokenId: eb.ref('excluded.sourceTokenId'),
        })),
      )
      .returning('id')
      .executeTakeFirstOrThrow()
  }

  async upsertMany(records: UpsertableTokenBridgeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRecord)
    await this.batch(rows, 100, async (batch) => {
      await this.db
        .insertInto('TokenBridge')
        .values(batch)
        .onConflict((cb) =>
          cb.column('targetTokenId').doUpdateSet((eb) => ({
            externalBridgeId: eb.ref('excluded.externalBridgeId'),
            sourceTokenId: eb.ref('excluded.sourceTokenId'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteByTokenId(tokenId: string): Promise<bigint> {
    const result = await this.db
      .deleteFrom('TokenBridge')
      .where((eb) =>
        eb('targetTokenId', '=', tokenId).or('sourceTokenId', '=', tokenId),
      )
      .executeTakeFirstOrThrow()

    return result.numDeletedRows
  }
}
