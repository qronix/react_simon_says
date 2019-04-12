import React, {Component} from 'react';
import GameButton from './gameButton';
import {SOUND_FILES} from '../sounds';
import GameControls from './gameControls';
import ReactHowler from 'react-howler';

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
        this.timeBetweenPCMoves = 800;
        this.buttonRefs = [
            {id:0, ref: React.createRef()},
            {id:1, ref: React.createRef()},
            {id:2, ref: React.createRef()},
            {id:3, ref: React.createRef()},
        ];
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.playCompMoves = this.playCompMoves.bind(this);
    }

    handleButtonClick(color){
        const choiceIndex = this.colors.indexOf(color);
        this.setState({userMoves:[...this.state.userMoves, choiceIndex]},()=>{
            this.checkPlayerMoves();
            // this.toggleControls();
            // this.toggleTurns(this.playGame);
        });
    }

    handleControlClick = (action) => {
        if(action==="start"){
            this.startGame();
        }
    }

    startGame(){
        this.setState({playing:true, compsTurn:true, started:true}, ()=>this.playGame());
    }

    toggleControls(){
        if(this.state.compsTurn){
            for(let item in this.buttonRefs){
                this.buttonRefs[item].ref.current.disableButton();
            }
        }else{
            for(let item in this.buttonRefs){
                this.buttonRefs[item].ref.current.enableButton();
            }
        }
    }

    toggleTurns(fn){
        if(this.state.compsTurn){
            return this.setState({compsTurn:false, playerTurn:true, playerPlayed:false}, fn);
        } else{
            return this.setState({compsTurn:true, playerTurn:false}, fn);
        }
    }

    playGame(){
        if(this.state.compsTurn && this.state.playing){
            console.log('My turn!');
            this.setState({userMoves:[]});
            this.toggleControls();
            let number = this.generateNumber();
            this.setState({gameMoves:[...this.state.gameMoves, number]}, ()=>this.playCompMoves());
            // this.playCompMoves();
            this.toggleTurns(this.toggleControls);
            this.playerTurnTimer();
        }
        if(this.state.playerTurn && this.state.playing){
        }
    }

    async playCompMoves(){
        for(let i=0; i<this.state.gameMoves.length; i++){
            let colorIndex = this.state.gameMoves[i];
            await new Promise(resolve=>{
                setTimeout(()=>{
                    resolve(this.buttonRefs[colorIndex].ref.current.autoClick());
                },this.timeBetweenPCMoves);
            });
        }
    }
    checkPlayerMoves(){
        // let correctMoves = this.state.gameMoves.every(item=>this.state.gameMoves[item]===this.state.userMoves[item]);
        for(let i=0; i<this.state.userMoves.length; i++){
            if(this.state.gameMoves[i] !== this.state.userMoves[i]){
                return this.gameOver();
            }
        }
        console.log('Nice job!');
        if(this.state.userMoves.length === this.state.gameMoves.length){
            this.setState({playerPlayed:true},()=>{
                this.toggleControls();
                this.toggleTurns(this.playGame);
            });
        }
    }

    gameOver(){
        console.log('WRONG!');
        console.log(`PC moves: ${console.dir(this.state.gameMoves)}`)
        console.log(`Your moves: ${console.dir(this.state.userMoves)}`)
        // this.setState({
        //     gameMoves:[],
        //     userMoves:[],
        //     playing: false,
        //     compsTurn: false,
        //     playerTurn: false,
        //     started:false,
        //     lost:false,
        //     playerPlayed:false
        // });
        this.setState({
            playing:false,
            lost:true
        });
    }

    playerTurnTimer = ()=>{
        setTimeout(()=>{
            if(!this.state.playerPlayed && this.state.playerTurn){
                // this.gameOver();
                console.log('You didn\'t play');
            }
        },3000);
    }

    generateNumber=()=>Math.floor(Math.random()*(this.buttonRefs.length));


    render() {
        return(          
            <div id="main__simon__game__container">
            <div id="main__simon__game__container__center">    
                <span>SIMON</span>
                <div id="main__simon__game__container__center__controls__display">{this.state.gameMoves.length}</div>
                <ReactHowler src/>
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