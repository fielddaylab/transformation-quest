import React, { useState } from "react"
import { BrowserRouter, Switch } from "react-router-dom"
import { level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11 } from './levelData'
import LevelModel from "./model/levelModel"
import LevelSelector from "./components/levelSelector"
import Introduction from "./components/introduction"
import Title from "./components/title"
import LevelProgression from './model/levelProgressionModel'
import LevelContainer from './components/levelContainer'
import { Route, Redirect } from "react-router-dom"
import './app.css'

const gameLevels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11]

const App = ({ RouterComponent = BrowserRouter, levels = gameLevels }) => {
  const numberedLevels = levels.map((level, i) => new LevelModel({ ...level, number: i + 1 }))
  const [levelProgression, setLevelProgression] = useState(new LevelProgression({ levels: numberedLevels }));
  const subdir = process.env.REACT_APP_SUBDIR;
  return <RouterComponent basename={subdir}>
    <Switch>
      <Route path={"/title"}><Title levelProgression={levelProgression} setLevelProgression={setLevelProgression}/></Route>
      <Route path={"/introduction"}><Introduction/></Route>
      <Route path={"/selection"}><LevelSelector levelProgression={levelProgression}/></Route>
      {levelProgression.levels.map((levelModel, i) =>
        <Route path={"/level/" + levelModel.number} key={i}>
          {!levelProgression.canPlay(levelModel.number) && <Redirect to={"/level/" + levelProgression.currentLevel()} />}
          <LevelContainer levelModel={levelModel} afterExecute={newModel => {setLevelProgression(levelProgression.progress(newModel))}} />
        </Route>
      )}
      <Redirect to="/title" />
    </Switch>
  </RouterComponent>
}

export default App