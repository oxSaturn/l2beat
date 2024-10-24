import path from 'path'
import { UnixTime } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { cwd } from 'process'
import superjson from 'superjson'
import { zkCatalogProjects } from '.'

superjson.registerCustom<UnixTime, string>(
  {
    isApplicable: (value) => value instanceof UnixTime,
    serialize: (value) => value.toString(),
    deserialize: (value) => new UnixTime(parseInt(value)),
  },
  'UnixTime',
)

function main() {
  writeFile(
    path.join(cwd(), 'src/resolved/zkCatalogProjects.json'),
    superjson.stringify(zkCatalogProjects),
  )
}

main()
