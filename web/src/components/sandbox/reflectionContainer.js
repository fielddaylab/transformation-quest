import React from 'react'

export default ({ updateModel, disabled }) => {
    return <>
        <h2 className="font-bold pb-2">Reflections</h2>
        <button className="btn-blue" disabled={disabled} onClick={() => updateModel('reflect', { axis: 'x'})} > Reflect About X-axis </button>
        <button className="btn-blue" disabled={disabled} onClick={() => updateModel('reflect', { axis: 'y'})} > Reflect About Y-axis </button>
    </>
}