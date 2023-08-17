import React, { Component } from 'react'

export default class TranslationContainer extends Component {
    state = {
        translationAmountValid: true,
        translationAmount: 1
    }

    translationAmountUpdate = event => {
        let translationAmount = event.target.value
        let translationAmountAsInteger = parseInt(translationAmount)
        // eslint-disable-next-line
        let translationAmountValid = translationAmountAsInteger > 0 && translationAmount == translationAmountAsInteger
        this.setState({ translationAmount, translationAmountValid })
    }

    render() {
        let { translationAmount, translationAmountValid } = this.state
        let { updateModel, disabled } = this.props
        let disableButton = !translationAmountValid || disabled

        return <>
            <h2 className="font-bold pb-2">Translation</h2>
            <label>
                Translation amount:
                    <input type="number" data-testid="amount-input" className='w-32 mb-5 ml-2 pl-2 border-solid border-4' name="translationAmount" min="1" value={translationAmount} onChange={this.translationAmountUpdate} />
            </label>
            {!translationAmountValid && <div className="ml-5 text-red-600" >Enter an integer 1 or greater</div>}
            <br />
            <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('translateX', { dx: Number(-translationAmount) })} > Go Left </button>
            <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('translateX', { dx: Number(translationAmount) })} > Go Right </button>
            <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('translateY', { dy: Number(-translationAmount) })} > Go Down </button>
            <button className="btn-blue" disabled={disableButton} onClick={() => updateModel('translateY', { dy: Number(translationAmount) })} > Go Up </button>
        </>
    }
}
