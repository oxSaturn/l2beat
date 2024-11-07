import { expect } from 'earl'
import { daLayers } from '.'
import { layer2s } from '../../layer2s'
import { layer3s } from '../../layer3s'

describe('DA-BEAT', () => {
  daLayers.forEach((layer) => {
    describe(layer.display.name, () => {
      it('should contain description with dot at the end', () => {
        expect(layer.display.description.endsWith('.')).toEqual(true)
      })

      layer.bridges.forEach((bridge) => {
        describe(bridge.display.name, () => {
          it(`should contain bridge description with dot at the end`, () => {
            expect(bridge.display.description.endsWith('.')).toEqual(true)
          })
        })
      })
    })
  })

  describe('synchronization with scaling projects - layer2s and layer3s', () => {
    it('each scaling project should have a corresponding entry in the DA-BEAT', () => {
      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s]
        .filter(
          (project) =>
            !project.isUpcoming &&
            !project.isUnderReview &&
            !project.isArchived,
        )
        .filter(
          (project) =>
            project.display.category === 'Optimium' ||
            project.display.category === 'Validium',
        )
        .filter(
          // It makes no sense to list them on the DA-BEAT
          (scaling) => scaling.dataAvailability?.layer.value !== 'External',
        )

      const daBeatProjectIds = daLayers.flatMap((daLayer) =>
        daLayer.bridges.flatMap((bridge) =>
          bridge.usedIn.map((usedIn) => usedIn.id),
        ),
      )

      const scalingProjectIds = target.map((project) => project.id)

      const projectsWithoutDaBeatEntry = scalingProjectIds.filter(
        (project) => !daBeatProjectIds.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })
})
