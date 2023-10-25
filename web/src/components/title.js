import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { TitleButton } from "./uiComponents"
import { EnterCodeButton } from "./uiComponents"
import { ResumeButton } from "./uiComponents"
import StartScreen from "../assets/startScreen.svg"
import { loadDataCollectionSession, startDataCollectionSession } from "../model/dataCollectionApi"
import BackArrow from '../assets/backArrow.svg'
import reactLogger from "../model/reactLogger"

const Title = ({ levelProgression, setLevelProgression }) => {
    let history = useHistory()
    let [showingCodeEntry, setShowingCodeEntry] = useState(false)
    let [sessionId, setSessionId] = useState('')
    let [error, setError] = useState('')

    const onChange = (event) => {
        setSessionId(event.target.value);
        // OGDLogger.log("enter_code", {code:{sessionId}})
    }

    const resumeGame = () => {
        loadDataCollectionSession(sessionId).then(session => {
            console.log("Resume game:", sessionId)
            if (session.events) {
                session.events.forEach(event => {
                    if (event.type === 'runLevel') {
                        levelProgression = levelProgression.progress(event.endLevelModel)
                    }
                });
            }
            setError("")
            setLevelProgression(levelProgression)
            reactLogger.log("continue_game")
            // OGDLogger.log("continue_game")
            history.push('/selection')
        }).catch(error => {
            setError("Invalid Code - Please try again.")
            console.log(error)
        })
        
    }

    const startGame = () => {
        startDataCollectionSession()
        reactLogger.log("begin_game")
        // OGDLogger.log("begin_game");
        history.push('/introduction')
    }

    return <div className='w-screen h-screen bg-cover' style={{ backgroundImage: `url(${StartScreen})`, backgroundColor: '#71C0CE' }}>
        { !showingCodeEntry ?
            <div className='absolute mx-auto' style={{ bottom: '23%', right: 0, left: 0, display: "flex", direction: "row", justifyContent: "center", alignItems: "center" }}>
                <TitleButton data-testid='start-button' onClick={() => startGame()} className=' text-2xl ' >
                    Start a new game
                </TitleButton>
                <EnterCodeButton data-testid='enter-code-button' onClick={() => { setShowingCodeEntry(true) }} className=' text-2xl ' style={{ bottom: '23%', right: 0, left: 0 }}>
                    Enter a code
                </EnterCodeButton>
            </div>
            :
            <div className='absolute mx-auto' style={{ bottom: '23%', right: 0, left: 0, display: "flex", direction: "row", justifyContent: "center", alignItems: "center" }}>
                <img src={BackArrow} style={{cursor:"pointer"}} onClick={() => setShowingCodeEntry(false)} alt="Back"></img>
                <div className="px-2" style = {{display:"flex", flexDirection:"column"}}>
                    <input id="sessionCode"
                        style={{ fontFamily: "Sniglet", borderRadius: "5px", height: "40px", paddingLeft: "20px", border: "3px solid black" }}
                        spellcheck="false"
                        size="40"
                        onChange={onChange}
                        placeholder="Enter session code"></input>
                    <div style={{color: error !== '' ? 'red' : 'black', fontFamily: 'Sniglet', textAlign: "center", backgroundColor: 'white'}}>{error}</div>
                </div>
                <ResumeButton data-testid='resume-game-button' onClick={() => resumeGame()} className=' text-2xl ' >
                    Continue
                </ResumeButton>
                
            </div>
        }

    </div>
}

export default Title