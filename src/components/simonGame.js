import React, {Component} from 'react';
import GameButton from './gameButton';
import {SOUND_FILES} from '../sounds';

class SimonGame extends Component {

    state = {
        gameMoves:[],
        userMoves:[]
    }

    constructor(){
        super();
        this.colors  = ['red', 'green', 'blue', 'yellow'];
        this.buttonDelayTime = 500;
        this.buttonRefs = [
            {id:0, ref: React.createRef()},
            {id:1, ref: React.createRef()},
            {id:2, ref: React.createRef()},
            {id:3, ref: React.createRef()},
        ];
    }
    handleButtonClick = (color) => {

    }

    componentDidMount(){
    }

    render() {
        return(          
            <div id="main__simon__game__container">
            <div id="main__simon__game__container__center"/>
            <div id="main__simon__game__container__buttons">
                <GameButton onClick={this.handleButtonClick} color={this.colors[0]} sound={SOUND_FILES[0]} buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[0].ref}/>
                <GameButton onClick={this.handleButtonClick} color={this.colors[1]} sound={SOUND_FILES[1]} buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[1].ref}/>
                <GameButton onClick={this.handleButtonClick} color={this.colors[2]} sound={SOUND_FILES[2]} buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[2].ref}/>
                <GameButton onClick={this.handleButtonClick} color={this.colors[3]} sound={SOUND_FILES[3]} buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[3].ref}/>
            </div>
        </div>
        );
    }
}

export default SimonGame;