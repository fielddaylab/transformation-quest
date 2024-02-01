import LevelModel, { MEDALS } from "./levelModel"
import _ from 'lodash'

const isDev = process.env.REACT_APP_DEV

export default class LevelProgression {

  constructor(obj) {
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

  get levelData() {
    let list = [];
    for (let i = 0; i < this.levels.length; i++) {
      let status;
      if (this.canPlay(i+1)) {
        status = STATUS.AVAILABLE;
        if (this.levels[i].acquiredMedals.includes(MEDALS.bronze)) status = STATUS.BRONZE;
        if (this.levels[i].acquiredMedals.includes(MEDALS.silver)) status = STATUS.SILVER;
        if (this.levels[i].acquiredMedals.includes(MEDALS.gold)) status = STATUS.GOLD;
      } else {
        status = STATUS.UNAVAILABLE;
      }

      list.push({
        'level_name': this.levels[i].title,
        'status': status
      })
    }
    return list;
  }

}

const STATUS = {
  UNAVAILABLE: 'UNAVAILABLE',
  AVAILABLE: 'AVAILABLE',
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD'
  
}