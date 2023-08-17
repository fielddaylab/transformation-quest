import './assertions'
import LevelModel, { MEDALS } from "../model/levelModel"
import { testLevel1, testLevel2, completeTestLevel1WithBronze, completeTestLevel1WithSilver, completeTestLevel2WithBronze } from './fixtures'
import LevelProgression from '../model/levelProgressionModel'

describe('Level Progression Model', () => {

  const levelProgression = new LevelProgression({ levels: [testLevel1, testLevel2] })

  it('will record any medal if you get one and previously didnt have one', () => {
    expect(levelProgression.levels[0].acquiredMedals.length).toEqual(0)
    const levelToProgress = completeTestLevel1WithBronze(levelProgression.levels[0])
    const newLevelProgression = levelProgression.progress(levelToProgress)
    expect(newLevelProgression.levels[0].acquiredMedals).toContain(MEDALS.bronze)
  })

  it('will record all medals acquired', () => {
    const newLevelProgression = levelProgression.progress(completeTestLevel1WithBronze(levelProgression.levels[0]))
    expect(newLevelProgression.levels[0].acquiredMedals).toContain(MEDALS.bronze)
    const newLevelProgressionSilver = newLevelProgression.progress(completeTestLevel1WithSilver(levelProgression.levels[0]))
    expect(newLevelProgressionSilver.levels[0].acquiredMedals).toContain(MEDALS.bronze)
    expect(newLevelProgressionSilver.levels[0].acquiredMedals).toContain(MEDALS.silver)
  })

  it('can always play level 1', () => {
    expect(levelProgression.canPlay(1)).toBeTruthy()
  })

  it('can\'t play level 2 if level one does not get at least a bronze', () => {
    expect(levelProgression.canPlay(2)).toBeFalsy()
  })

  it('can play level 2 if level one does get at least a bronze', () => {
    const levelToProgress = completeTestLevel1WithBronze(levelProgression.levels[0])
    const newLevelProgression = levelProgression.progress(levelToProgress)
    expect(newLevelProgression.canPlay(2)).toBeTruthy()
  })

  it('should not be able to play a level that does not exist even if the previous was successfully completed with a bronze', () => {
    const levelToProgress = completeTestLevel2WithBronze(levelProgression.levels[1])
    const newLevelProgression = levelProgression.progress(levelToProgress)
    expect(newLevelProgression.canPlay(3)).toBeFalsy()
  })

})