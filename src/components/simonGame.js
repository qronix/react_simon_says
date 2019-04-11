import React, {Component} from 'react';
import GameButton from './gameButton';
import {SOUND_FILES} from '../sounds';
import GameControls from './gameControls';

class SimonGame extends Component {

    state = {
        gameMoves:[],
        userMoves:[],
        playing: false,
        compsTurn: false,
        playerTurn: false,
        started:false,
        lost:false,
        playerPlayed:false
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

    handleButtonClick(color){
        const choiceIndex = this.colors.findIndex(color);
        this.setState({userMoves:this.state.userMoves.push(choiceIndex), playerPlayed:true});
        this.checkPlayerMove();
        this.playGame();
    }

    handleControlClick = (action) => {
        if(action==="start"){
            console.log('going!');
            this.startGame();
        }
    }

    startGame(){
        console.log('starting!');
        this.setState({playing:true, compsTurn:true, started:true});
        this.playGame();
    }

    toggleControls(){
        if(this.state.compsTurn){
            for(let item in this.buttonRefs){
                item.ref.current.disableButton();
            }
        }else{
            for(let item in this.buttonRefs){
                item.ref.current.enableButton();
            }
        }
    }

    toggleTurns(){
        if(this.state.compsTurn){
            this.setState({compsTurn:false, playerTurn:true});
        } else{
            this.setState({compsTurn:true, playerTurn:false});
        }
    }

    playGame(){
        if(this.state.compsTurn && this.state.playing){
            console.log('PC turn!');
            this.toggleControls();
            let number = this.generateNumber();
            this.setState({gameMoves:this.state.gameMoves.push(number)});
            this.buttonRefs[number].ref.autoClick();
            this.toggleTurns();
            this.toggleControls();
        }
        if(this.state.playerTurn && this.state.playing){
            this.playerTurnTimer();
        }
    }

    checkPlayerMove(){
        let compMoves = this.state.gameMoves;
        let correctMoves = compMoves.every(item=>compMoves[item]===this.state.userMoves[item]);
        if(correctMoves){
            this.toggleTurns()
            this.playGame();
        }else{
            this.gameOver();
        }
    }

    gameOver(){
        console.log('WRONG!');
        this.setState({
            gameMoves:[],
            userMoves:[],
            playing: false,
            compsTurn: false,
            playerTurn: false,
            started:false,
            lost:false,
            playerPlayed:false
        });
    }

    playerTurnTimer = ()=>{
        setTimeout(()=>{
            if(!this.state.playerPlayed && this.state.playerTurn){
                this.gameOver();
            }
        },1000);
    }

    generateNumber=()=>Math.floor(Math.random()*(this.buttonRefs.length));


    render() {
        return(          
            <div id="main__simon__game__container">
            <div id="main__simon__game__container__center">    
                <span>SIMON</span>
                <div id="main__simon__game__container__center__controls__display">--</div>
            </div>
            <div id="main__simon__game__container__center__controls__container">
                <GameControls controlClick={this.handleControlClick}/>       
            </div>
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