import React, { useState } from 'react'

const formatCenter = (centerString) => {
    const [x, y] = centerString.split(",")
    return { x: parseInt(x), y: parseInt(y) }
}

export default ({ updateModel, disabled }) => {

    const [centerValue, setCenterValue] = useState('0,0')
    const [validCenter, setValidCenter] = useState(true)
    let disableButton = !validCenter || disabled

    const centerValueChanged = event => {
        let value = event.target.value
        setCenterValue(value)
        let center = formatCenter(value)
        setValidCenter(value.match(/^-?[0-9]+,-?[0-9]+$/) && (center.x >= -10 && center.x <= 10) && (center.y >= -10 && center.y <= 10))
    }

    return <>
        <h2 className="font-bold pb-2">Rotation</h2>
        <label>
            Rotation Center:
            <input data-testid="center-input" className='w-32 mb-5 ml-2 pl-2 border-solid border-4' name="translationAmount" min="1" value={centerValue} onChange={centerValueChanged} />
        </label>
        {!validCenter && (<div className="ml-5 text-red-600" >Center must be in the following format: x,y. Values must be between -10 and 10</div>)}
        <br />
        <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('rotate', { angle: 90, point: formatCenter(centerValue) })} > Rotate 90 Degrees </button>
        <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('rotate', { angle: 180, point: formatCenter(centerValue) })} > Rotate 180 Degrees </button>
        <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('rotate', { angle: 270, point: formatCenter(centerValue) })} > Rotate 270 Degrees </button>
    </>

}
