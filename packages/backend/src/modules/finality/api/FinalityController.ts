import { assert } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { FinalityApiResponse, UnixTime } from '@l2beat/shared-pure'
import { keyBy, mapValues, partition } from 'lodash'
import { FinalityProjectConfig } from '../../../config/features/finality'
import { LivenessWithConfigService } from '../../tracked-txs/modules/liveness/services/LivenessWithConfigService'
import { calcAvgsPerProject } from './calcAvgsPerProject'
import { divideAndAddLag } from './divideAndAddLag'

export interface FinalityControllerDeps {
  db: Database
  projects: FinalityProjectConfig[]
}

export class FinalityController {
  constructor(private readonly $: FinalityControllerDeps) {}

  async getFinality(): Promise<FinalityApiResponse> {
    const projects: FinalityApiResponse['projects'] = {}

    const [OPStackProjects, otherProjects] = partition(
      this.$.projects,
      (p) => p.type === 'OPStack',
    )
    const OPStackFinality = await this.getOPStackFinality(OPStackProjects)
    Object.assign(projects, OPStackFinality)

    const projectsFinality = await this.getProjectsFinality(otherProjects)
    Object.assign(projects, projectsFinality)

    return { projects }
  }

  async getProjectsFinality(
    projects: FinalityProjectConfig[],
  ): Promise<FinalityApiResponse['projects']> {
    const projectIds = projects.map((p) => p.projectId)
    const records =
      await this.$.db.finality.getLatestGroupedByProjectId(projectIds)

    const result: FinalityApiResponse['projects'] = mapValues(
      keyBy(records, 'projectId'),
      (record) => {
        const {
          averageStateUpdate,

          minimumTimeToInclusion,
          averageTimeToInclusion,
          maximumTimeToInclusion,

          projectId,
          timestamp,
        } = record

        const base = {
          syncedUntil: timestamp,
          timeToInclusion: {
            minimumInSeconds: minimumTimeToInclusion,
            maximumInSeconds: maximumTimeToInclusion,
            averageInSeconds: averageTimeToInclusion,
          },
        }

        const project = projects.find(
          (project) => project.projectId === projectId,
        )

        assert(project, 'Project not found in config')

        if (project.stateUpdate === 'zeroed') {
          return {
            ...base,
            stateUpdateDelays: {
              averageInSeconds: 0,
            },
          }
        }

        if (project.stateUpdate === 'disabled') {
          return {
            ...base,
            stateUpdateDelays: null,
          }
        }

        const hasStateUpdateDelay = averageStateUpdate !== null

        const stateUpdateDelays = hasStateUpdateDelay
          ? {
              averageInSeconds: averageStateUpdate - averageTimeToInclusion,
            }
          : null

        return {
          ...base,
          stateUpdateDelays,
        }
      },
    )

    return result
  }

  async getOPStackFinality(
    projects: FinalityProjectConfig[],
  ): Promise<FinalityApiResponse['projects']> {
    const result: FinalityApiResponse['projects'] = {}

    const configurations = (
      await this.$.db.indexerConfigurations.getSavedConfigurations(
        'tracked_txs_indexer',
      )
    ).map((c) => ({
      ...c,
      properties: JSON.parse(c.properties),
    }))

    await Promise.all(
      projects.map(async (project) => {
        const configsToUse = configurations
          .filter(
            (c) =>
              c.properties.projectId === project.projectId &&
              c.properties.subtype === 'batchSubmissions',
          )
          .map((c) => ({
            id: c.id,
            subtype: c.properties.subtype,
            currentHeight: c.currentHeight,
          }))

        if (!configsToUse) return

        const syncedUntil = new UnixTime(
          Math.max(
            ...configsToUse
              .map((c) => c.currentHeight)
              .filter((h): h is number => h !== null),
          ),
        )

        if (!syncedUntil) return

        // TODO: (sz-piotr) Refactor as dependency!
        const livenessWithConfig = new LivenessWithConfigService(
          configsToUse,
          this.$.db,
        )

        const records = await livenessWithConfig.getByTypeSince(
          'batchSubmissions',
          syncedUntil.add(-1, 'days'),
        )

        const intervals = calcAvgsPerProject(records)
        const projectResult = divideAndAddLag(intervals, project.lag)

        if (projectResult) {
          result[project.projectId.toString()] = {
            timeToInclusion: projectResult,
            stateUpdateDelays: null,
            syncedUntil,
          }
        }
      }),
    )
    return result
  }
}
