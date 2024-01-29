import LevelModel from "./levelModel"
import _ from 'lodash'

const isDev = process.env.REACT_APP_DEV

export default class LevelProgression {

  constructor(obj) {
    console.log("new levelProgression?")
    this.levels = obj.levels.map((level, i) => new LevelModel({ ...level, number: i + 1 }))
    this.hasCompletedGame = obj.hasCompletedGame || false
  }

  progress(model) {
    const newLevels = Array.from(this.levels)
    const matchingModelIndex = _.findIndex(newLevels, level => level.number === model.number)
    const matchingModel = newLevels[matchingModelIndex]
    newLevels[matchingModelIndex] = new LevelModel({
      ...matchingModel,
      acquiredMedals: _.uniq([...matchingModel.acquiredMedals, ...model.acquiredMedals])
    })
    return new LevelProgression({ ...this, levels: newLevels })
  }

  canPlay(levelNumber) {
    if (isDev) return true
    const priorLevel = this.levels.find(level => level.number === levelNumber - 1)
    const levelExists = this.levels.find(level => level.number === levelNumber)
    if (levelExists && !priorLevel) return true
    return priorLevel && priorLevel.acquiredMedals.length > 0 && !!levelExists
  }

  currentLevel() {
    const lastCompleteLevelIndex = _.findLastIndex(this.levels, level => level.acquiredMedals.length > 0)
    return _.clamp(lastCompleteLevelIndex, -1, this.levels.length - 2) + 2
  }

}