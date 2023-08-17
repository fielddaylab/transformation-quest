import React, { Component } from 'react'
import SandboxModel from '../../model/sandboxModel'
import TranslationContainer from './translationContainer'
import RotationContainer from './rotationContainer'
import ReflectionContainer from './reflectionContainer'
import { Polygon } from '../../model/shapes'
import { Shape, PlayingField } from '../gameComponents'

export default class SandboxContainer extends Component {

    state = {
        sandboxModel: null
    }

    componentDidMount() {
        this.setState({ sandboxModel: this.props.sandboxModel || new SandboxModel({ playerToken: new Polygon([{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 3 }]) }) })
    }

    updateModel(methodName, args) {
        let sandboxModel = this.state.sandboxModel
        try {
            let updatedSandbox = sandboxModel[methodName](args)
            this.setState({ sandboxModel: updatedSandbox, error: null })
        }
        catch (error) {
            this.setState({ error: error.message })
        }
    }

    render() {
        let { sandboxModel, error } = this.state
        if (!sandboxModel) return null
        return (
            <div className="flex flex-wrap p-5">
                <div className="flex-1">
                    {error && <div className="mt-5 text-red-600">{error}</div>}
                    <PlayingField axisRange={sandboxModel.axisRange}>
                        <Shape vertices={sandboxModel.playerToken.vertices} data-testid='player-token' />
                    </PlayingField>
                </div>
                <div className="pl-5 flex-1">
                    <TranslationContainer updateModel={this.updateModel.bind(this)} />
                    <RotationContainer updateModel={this.updateModel.bind(this)} />
                    <ReflectionContainer updateModel={this.updateModel.bind(this)} />
                </div>
            </div>
        )
    }

}