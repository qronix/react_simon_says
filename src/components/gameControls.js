import React, {Component} from 'react';

export default class GameControls extends Component{

    constructor({controlClick}){
        super();
        this.controlClick = controlClick;
    }

    handleClick(action){
        this.controlClick(action)
    }

    render(){
        return(
        <div id="main__simon__game__container__center__controls__container__buttons">
            <div id="main__simon__game__container__center__controls__container__buttons--audio" onClick={()=>this.handleClick('audio')}></div>
            <div id="main__simon__game__container__center__controls__container__buttons--reset" onClick={()=>this.handleClick('reset')}></div>
            <div id="main__simon__game__container__center__controls__container__buttons--start" onClick={()=>this.handleClick('start')}></div>
        </div>
        );
    }
}