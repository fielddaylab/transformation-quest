import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import counterIcon from "../assets/storyCounter.svg"
import textBubble from '../assets/storyBubble.svg'
import monster1 from '../assets/Monster1.svg'
import monster2 from '../assets/Monster2.svg'
import monster3 from '../assets/Monster3.svg'
import monster4 from '../assets/Monster4.svg'
import { IntroductionButton } from './uiComponents'

const textMap = [
    <>You have been selected to save the <span className='text-highlight'>Planet of Adanac</span>, which has recently come under attack by invaders from the Planet Smreg.<br></br> <br></br>
        <span className='text-highlight'>Your Mission:</span> deliver the magical gems to the Queen in order to rid the land of the invaders and protect the planet.<br></br> <br></br>
    You have special transformative powers - the ability to <span className='text-highlight'>translate, reflect, and rotate</span>. These powers will help you avoid being captured and allow you to complete your ultimate quest. Only you can help! </>,
    
    <>Each <span className='text-highlight'>Gem</span> contains magical power from the core of the planet -  to help you defeat the invaders. Each <span className='text-highlight'>Shield</span> you collect protects the people of Adanac. The more valuable the shield, the more powerful the protection. The key to being awarded the shields comes from the magical gems you gather. Each level in your quest has <span className='text-highlight'>Objectives</span> to guide you:  which gems to collect, and how to unlock the shields.
    <br></br> <br></br>
    Be careful though. The invaders know the power of the gems and are trying to keep you from them. If you come in contact with them, they will capture you, which will cost you valuable time in reaching the Queen.</>,
    
    <>Time is of the essence! Collect gems by <span className='text-highlight'>translating from position to position</span>, while making sure you do not land on the location the invaders occupy. You must be clever in selecting which power to use. 
    <br></br><br></br>
    Think this through carefully. According to the scrolls, you will have <span className='text-highlight'>limited moves</span> to complete your mission. 
    <br></br><br></br>
    Best of luck as you complete this quest. Adanac is counting on you!</>
]

const Bubble = ({ children, className, ...rest }) => <div
    {...rest}
    className={'flex justify-center items-center relative text-2xl ' + className}
    style={{
        backgroundImage: `url(${textBubble})`, padding: '50px 50px 180px 50px',
        fontFamily: 'Sniglet', width: '942px', height: '615px', zIndex: 2, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
    }}>
    {children}
</div>

const Counter = ({ children, style, className, ...rest }) => <div
    {...rest}
    className={'flex justify-center items-center text-2xl ' + className}
    style={{
        backgroundImage: `url(${counterIcon})`,
        fontFamily: 'Sniglet', width: '80px', height: '85px', zIndex: 2, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
        ...style
    }}>
    {children}
</div>

const Monster = ({ children, className, monster, style, ...rest }) => <div
    {...rest}
    style={{
        backgroundImage: `url(${monster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
        ...style
    }}>
    {children}
</div>

export default () => {
    let history = useHistory()
    const [activeIndex, setActiveIndex] = useState(0)

    const onClickForward = () => {
        // OGDLogger.log("click_tutorial_next", {from_index: activeIndex})
        activeIndex < 2 ? setActiveIndex(activeIndex + 1) : history.push('/selection')
    }
    const onClickBack = () => {
        // OGDLogger.log("click_tutorial_back, {from_index: activeIndex})
        setActiveIndex(activeIndex - 1)
    }

    return <div className='h-screen' style={{ backgroundColor: '#71C0CE' }}>
        <div className='mx-3 pt-32 text-storyWhite flex justify-center items-center' style={{ zIndex: 1 }}>
            <Monster
                monster={monster4}
                style={{ position: 'absolute', top: '18px', right: '200px', width: '211px', height: '238px' }}>
            </Monster>

            <Bubble>
                <div style={{ width: '750px', marginTop:'50px', whiteSpace: 'pre-line' }}>
                    {textMap[activeIndex]}
                </div>

                <Counter className='absolute'
                    style={{ top: '-40px', left: '90px' }}>
                    {activeIndex + 1}/{textMap.length}
                </Counter>

                <IntroductionButton
                    onClick={onClickForward}
                    className='absolute text-2xl' data-testid={'next-button-' + activeIndex}
                    style={{ bottom: '100px', right: '-60px' }}
                >
                    Next
            </IntroductionButton>

                <IntroductionButton
                    onClick={onClickBack}
                    className='absolute text-2xl' data-testid='back-button'
                    style={{ bottom: '100px', left: '-60px', visibility: activeIndex === 0 ? 'hidden' : 'visible' }}
                >
                    Back
            </IntroductionButton>

                <Monster
                    monster={monster1}
                    style={{ position: 'absolute', top: '200px', left: '-150px', zIndex: 5, width: '223px', height: '193px' }}>
                </Monster>

                <Monster
                    monster={monster2}
                    style={{ position: 'absolute', bottom: '-50px', right: '350px', zIndex: 5, width: '160px', height: '167px' }}>
                </Monster>

                <Monster
                    monster={monster3}
                    style={{ position: 'absolute', bottom: '-50px', left: '250px', zIndex: 5, width: '157px', height: '193px' }}>
                </Monster>

            </Bubble>
        </div>
    </div>
}


