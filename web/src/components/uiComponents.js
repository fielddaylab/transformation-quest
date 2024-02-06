import React, {useState} from 'react'
import newGameButton from '../assets/newGameButton.svg'
import enterCodeButton from '../assets/enterCodeButton.svg'
import continueButton from '../assets/continueButton.svg'
import cuteButton from '../assets/nextButton.svg'
import missionButton from '../assets/blueButton.svg'
import RunButton from '../assets/runButton.svg'
import NextLevelButton from '../assets/nextLevelButton.svg'
import ReplayLevelButton from '../assets/replayLevelButton.svg'
import Parchment from '../assets/Parchment.svg'

import BronzeShield from '../assets/bronzeShield.svg'
import SilverShield from '../assets/silverShield.svg'
import GoldShield from '../assets/goldShield.svg'
import HtpNormal1 from '../assets/how-to-play/normal-1.png'
import HtpNormal2 from '../assets/how-to-play/normal-2.png'
import HtpNormal3 from '../assets/how-to-play/normal-3.png'
import HtpCreative1 from '../assets/how-to-play/creative-1.png'
import HtpCreative2 from '../assets/how-to-play/creative-2.png'

import { TIMERS, logEvent, logTime, secsSinceLast } from '../model/reactLogger'
import { Frame } from "framer"
import { getReactElementText } from './introduction'

export const TitleButton = ({ children, style, className, ...rest }) => <div
  {...rest}
  className={'flex justify-center items-center text-black ' + className}
  style={{ backgroundImage: `url(${newGameButton})`, fontFamily: 'Sniglet', width: '250px', height: '75px', cursor: 'pointer', backgroundSize: '100% 100%', ...style }}>
  {children}
</div>

export const EnterCodeButton = ({ children, style, className, ...rest }) => <div
  {...rest}
  className={'flex justify-center items-center text-white ' + className}
  style={{ backgroundImage: `url(${enterCodeButton})`, fontFamily: 'Sniglet', width: '250px', height: '75px', cursor: 'pointer', backgroundSize: '100% 100%', ...style }}>
  {children}
</div>

export const ResumeButton = ({ children, style, className, ...rest }) => <div
  {...rest}
  className={'flex justify-center items-center text-white ' + className}
  style={{ backgroundImage: `url(${continueButton})`, fontFamily: 'Sniglet', width: '169px', height: '75px', cursor: 'pointer', backgroundSize: '100% 100%', ...style }}>
  {children}
</div>

export const IntroductionButton = ({ children, style, className, ...rest }) => <div
  {...rest}
  className={'flex justify-center items-center text-black ' + className}
  style={{ backgroundImage: `url(${cuteButton})`, width: '144px', height: '67px', zIndex: 3, cursor: 'pointer', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', ...style }}>
  {children}
</div>

export const RestartButton = ({ ...props }) =>
  <div data-testid='start-over' className={'flex justify-center items-center text-black'} {...props}
    style={{
      backgroundImage: `url(${RunButton})`, width: '220px', height: '55px', zIndex: 3, cursor: 'pointer',
      backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'
    }}>Okay</div>

export const AdvanceLevelButton = ({...props}) => 
<div data-testid='next-level' className={'flex justify-center items-center text-white'} {...props}
    style={{
      backgroundImage: `url(${NextLevelButton})`, width: '220px', height: '55px', zIndex: 3, cursor: 'pointer',
      backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'
    }}>Go to next level</div>

export const PlayAgainButton = ({ ...props }) =>
<div data-testid='start-over' className={'flex justify-center items-center text-black'} {...props}
  style={{
    backgroundImage: `url(${ReplayLevelButton})`, width: '220px', height: '55px', zIndex: 3, cursor: 'pointer',
    backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'
  }}>Replay level</div>

export const MissionButton = ({ children, style, className, ...rest }) =>
  <div
    className={'flex justify-center items-center text-white ' + className}
    style={{
      backgroundImage: `url(${missionButton})`, width: '120px', height: '50px', cursor: 'pointer',
      backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', fontFamily: 'Sniglet', ...style
    }} {...rest}
  >
    {children}
  </div>

export const HowToPlayModal = ({children, NextPage, PreviousPage, setHowToPlayPage, pageIndex, onClose}) => {
  const divText = getReactElementText(children);
  logEvent("level_rules_displayed", {rules_index: pageIndex, rules_text: divText})
  return <div className='z-50 flex items-start fixed inset-0 bg-missionModal justify-center items-center' style={{ fontFamily: 'sniglet' }}>
    <Frame initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} width='700px' height='550px' background=''>
      <div
        className={'flex justify-center items-center z-40'}
        style={{
          backgroundImage: `url(${Parchment})`, height: '100%', width: '100%',
          backgroundSize: '100% 100%',
        }}
      >
        <button onClick={() => onClose(pageIndex)} className='absolute top-0 right-0 mt-4 mr-12 text-4xl'>x</button>
        {children}
        { PreviousPage && // if PreviousPage, add this button
          <button onClick={() => {
            logEvent("click_level_rules_back", {from_index: pageIndex})
            pageIndex--;
            setHowToPlayPage(<PreviousPage onClose={onClose} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex}/> )
          }} 
            className='absolute bottom-0 left-0 mb-6 ml-6 text-x1'
            style={{ backgroundImage: `url(${cuteButton})`, width: '144px', height: '67px', zIndex: 3, cursor: 'pointer', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
              Back
          </button>
        }
        { NextPage ?  // if NextPage, add this button...
          <button onClick={() => {
            logEvent("click_level_rules_next", {from_index: pageIndex})
            pageIndex++;
            setHowToPlayPage(<NextPage onClose={onClose} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex}/>)
          }} 
            className='absolute bottom-0 right-0 mb-6 mr-6 text-x1'
            style={{ backgroundImage: `url(${cuteButton})`, fontFamily: 'Sniglet', width: '144px', height: '67px', zIndex: 3, cursor: 'pointer', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
              Next
          </button>
          : // else add this button
          <button onClick={() => {
            onClose(pageIndex);
            logEvent("click_level_rules_finish")
          }} 
            className='absolute bottom-0 right-0 mb-6 mr-6 text-x1'
            style={{ backgroundImage: `url(${continueButton})`, fontFamily: 'Sniglet', width: '144px', height: '67px', cursor: 'pointer', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
              Ok!
          </button>

        }
      </div>
    </Frame>
  </div >
}

export const HowToPlayRegular1 = ({setHowToPlayPage, pageIndex, onClose}) => 
  <HowToPlayModal NextPage={HowToPlayRegular2} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center px-16 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">Place the <span style={{color: "red"}}> RED </span> triangle in the <span style={{color: "red"}}> EXIT </span> by creating and running a block sequence.</div>
      <img src={HtpNormal1} alt=""/>
    </div>
  </HowToPlayModal>


export const HowToPlayRegular2 = ({setHowToPlayPage, pageIndex, onClose}) =>
  <HowToPlayModal PreviousPage={HowToPlayRegular1} NextPage={HowToPlayRegular3} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center px-32 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Before you begin each level, click on the 
        <span style={{color: "rgb(87,107,145)"}}> OBJECTIVES </span> and <span style={{color: "rgb(87,107,145)"}}> LEGEND </span> 
        on the top right of the screen for instructions.</div>
      <img src={HtpNormal2} alt=""/>
    </div>
  </HowToPlayModal>

export const HowToPlayRegular3 = ({setHowToPlayPage, pageIndex, onClose}) =>
  <HowToPlayModal PreviousPage={HowToPlayRegular2} NextPage={HowToPlayRegular4} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center px-32 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Avoid the <span style={{color: "purple"}}> ENEMIES </span> and get the colored
        <span style={{color: "#ffbe1c"}}> GEMS </span> according to the <span style={{color: "rgb(87,107,145)"}}> OBJECTIVES </span>
        before you reach the <span style={{color: "red"}}> EXIT </span>.
      </div>
      <img src={HtpNormal3} alt=""/>
    </div>
  </HowToPlayModal>

export const HowToPlayRegular4 = ({setHowToPlayPage, pageIndex, onClose}) =>
  <HowToPlayModal PreviousPage={HowToPlayRegular3} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center px-32 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Collect the <span style={{color: "#bf712b"}}> SHIELDS </span> to protect the people of Adanac
        according to the <span style={{color: "rgb(87,107,145)"}}> OBJECTIVES </span> in each level.
      </div>
      <div className="pt-8 space-x-4">
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Bronze Shield'} src={BronzeShield}/> Bronze
        </div>
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Silver Shield'} src={SilverShield}/> Silver
        </div>
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Gold Shield'} src={GoldShield}/> Gold
        </div>
      </div>
      <div className="pt-4 text-center">The more valuable the shield, the more powerful the protection!</div>
    </div>
  </HowToPlayModal>


export const HowToPlayCreative1 = ({setHowToPlayPage, pageIndex, onClose}) => 
  <HowToPlayModal NextPage={HowToPlayCreative2} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center py-16 px-16 text-xl" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Landing on a <span style={{color: "#ffbe1c"}}> YELLOW triangle gives you 2 points</span> and landing on a 
        <span style={{color: "purple"}}> PURPLE triangle gives you 1 point</span>.
        In order to finish the level, create a coding sequence to <span style={{color: "red"}}> COLLECT 10 POINTS </span>
        using a limited number of blocks.
      </div>
      <img src={HtpCreative1} alt=""/>
    </div>
  </HowToPlayModal>


export const HowToPlayCreative2 = ({setHowToPlayPage, pageIndex, onClose}) =>
  <HowToPlayModal PreviousPage={HowToPlayCreative1} NextPage={HowToPlayCreative3} pageIndex={pageIndex}  setHowToPlayPage={setHowToPlayPage} onClose={onClose}>
    <div className="flex flex-col items-center px-32 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Before you begin each level, click on the 
        <span style={{color: "rgb(87,107,145)"}}> OBJECTIVES </span> and <span style={{color: "rgb(87,107,145)"}}> LEGEND </span> 
        on the top right of the screen for instructions.</div>
      <img src={HtpCreative2} alt=""/>
    </div>
  </HowToPlayModal>

export const HowToPlayCreative3 = ({setHowToPlayPage, pageIndex, onClose}) =>
  <HowToPlayModal PreviousPage={HowToPlayCreative2} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} onClose={onClose}>
    <div className="flex flex-col items-center px-32 text-xl pb-16" style={{ whiteSpace: 'pre-line' }}>
      <div className="text-center">
        Collect the <span style={{color: "#bf712b"}}> SHIELDS </span> to protect the people of Adanac
        according to the <span style={{color: "rgb(87,107,145)"}}> OBJECTIVES </span> in each level.
      </div>
      <div className="pt-8 space-x-4">
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Bronze Shield'} src={BronzeShield}/> Bronze
        </div>
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Silver Shield'} src={SilverShield}/> Silver
        </div>
        <div className="inline">
          <img className="inline" style={{ width: '63px', height: '87px'}} alt={'Gold Shield'} src={GoldShield}/> Gold
        </div>
      </div>
      <div className="pt-4 text-center">The more valuable the shield, the more powerful the protection!</div>
    </div>
  </HowToPlayModal>

export const MissionModal = ({ children, onClose, className = '', creative, storyText, ...rest }) => {
  let [howToPlayPage, setHowToPlayPage] = useState(null)
  let pageIndex = 1;

  const onCloseHowToPlay = (page) => {
    setHowToPlayPage(null) // on close, set the page to null
    // if (!page) return;
    logEvent("click_level_rules_exit", {from_index: page})
  }

  const onClickPlay = () => {
    logEvent("click_level_play")
    logEvent("click_dismiss_mission", {time_open: secsSinceLast(TIMERS.MISSION)})
    onClose(null);
  }

  let HowToPlay = creative ? HowToPlayCreative1 : HowToPlayRegular1

  const onClickRules = () => {
    logEvent("click_display_level_rules")
    // create the first how to play page (reg or creative) and assign the base onClose function
    setHowToPlayPage(<HowToPlay onClose={page => onCloseHowToPlay(page)} setHowToPlayPage={setHowToPlayPage} pageIndex={pageIndex} />)
  }

  if (!howToPlayPage) {
    logEvent("level_mission_displayed", {mission_text: storyText})
    logTime(TIMERS.MISSION)
  }

  return howToPlayPage || // if a howToPlayPage is set, use that, otherwise use this
  <div className='z-30 flex items-start fixed inset-0 bg-missionModal justify-center items-center' style={{ fontFamily: 'sniglet' }}>
    <Frame initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} width='450px' height='550px' background=''>
      <div
        className={'flex justify-center items-center z-40 mb-16'}
        style={{
          backgroundImage: `url(${Parchment})`, height: '100%', width: '100%',
          backgroundSize: '100% 100%',
        }}{...rest}
      >
        {children}
        <button onClick={onClickPlay} 
          className='absolute bottom-0 right-0 mb-2 mr-6 text-x1'
          style={{ backgroundImage: `url(${continueButton})`, fontFamily: 'Sniglet', width: '120px', height: '90px', cursor: 'pointer', backgroundSize: '100% 100%'}}>
            Play!
        </button>
        <button onClick={onClickRules}
          className='absolute bottom-0 left-0 mb-2 ml-6 text-x1'
          style={{ backgroundImage: `url(${newGameButton})`, fontFamily: 'Sniglet', width: '200px', height: '90px', cursor: 'pointer', backgroundSize: '100% 100%'}}>
            { creative ? "Creative Rules" : "Rules"}
        </button>
      </div>
    </Frame>
  </div >
}