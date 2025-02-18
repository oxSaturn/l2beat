import { createDatabase } from '@l2beat/database'
import { env } from '~/env'

export const db = createDatabase({
  application_name: createConnectionTag(),
  connectionString: env.DATABASE_URL,
  ssl: ssl(),
  ...pool(),
})

function createConnectionTag() {
  // Tag is limited to 63 characters, so it will cut off the excess
  const base = `INSIGHT-${toShort()}`

  if (env.VERCEL_ENV === 'preview') {
    return `${base}-${env.VERCEL_GIT_COMMIT_REF}-${env.VERCEL_GIT_COMMIT_SHA}`
  }

  return base
}

function ssl() {
  return env.NODE_ENV === 'production' ||
    env.DATABASE_URL.includes('amazonaws.com')
    ? { rejectUnauthorized: false }
    : undefined
}

function pool() {
  if (env.NODE_ENV === 'production') {
    return {
      min: 2,
      max: 10,
    }
  }

  return {
    min: 2,
    max: 5,
  }
}

function toShort() {
  return env.NODE_ENV === 'production' ? 'prod' : 'dev'
}
