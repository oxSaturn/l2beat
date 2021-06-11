import fs from 'fs'

const PRECOMPUTED_FILE_PATH = 'cache/precomputed.json'
const CACHE_FILE_PATH = 'cache/cache.json'

export class CacheFile {
  read() {
    const precomputed = fs.readFileSync(PRECOMPUTED_FILE_PATH, 'utf-8')
    const cache = fs.existsSync(CACHE_FILE_PATH)
      ? fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
      : '{}'
    return { ...JSON.parse(cache), ...JSON.parse(precomputed) }
  }

  write(data: unknown) {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  }
}
