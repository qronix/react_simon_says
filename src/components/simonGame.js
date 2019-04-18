import React, { Component } from 'react';
import ReactHowler from 'react-howler';
import GameButton from './gameButton';
import {SOUND_FILES} from '../sounds';
import GameControls from './gameControls';

class SimonGame extends Component {

    state = {
      gameMoves: [],
      userMoves: [],
      playing: false,
      compsTurn: false,
      playerTurn: false,
      started: false,
      lost: false,
      playerPlayed: false,
      audioEnabled: true,
      playingSound: false,
      currentSound: SOUND_FILES[0],
    }

    constructor() {
      super();
      this.colors = ['red', 'green', 'blue', 'yellow'];
      this.buttonDelayTime = 500;
      this.timeBetweenPCMoves = 800;
      this.buttonRefs = [
        { id: 0, ref: React.createRef() },
        { id: 1, ref: React.createRef() },
        { id: 2, ref: React.createRef() },
        { id: 3, ref: React.createRef() },
      ];
      this.handleButtonClick = this.handleButtonClick.bind(this);
      this.playCompMoves = this.playCompMoves.bind(this);
      this.startGame = this.startGame.bind(this);
      this.toggleControls = this.toggleControls.bind(this);
      this.checkPlayerMoves = this.checkPlayerMoves.bind(this);
      this.howlerRef = React.createRef();
      this.soundColorMap = {
          'red':0,
          'green':1,
          'blue':2,
          'yellow':3
      }
    }

    handleButtonClick(color) {
      const choiceIndex = this.colors.indexOf(color);
      this.setState({ userMoves: [...this.state.userMoves, choiceIndex] }, () => {
        this.playSound(color);
        this.checkPlayerMoves();
      });
    }

    playSound(color){
        if(this.state.audioEnabled){
            let soundIndex = this.soundColorMap[color] || this.soundColorMap['red'];
            this.setState({ currentSound:SOUND_FILES[soundIndex], playingSound: true });
        } else{
            this.setState({ playingSound:false });
        }
    }

    handleControlClick = (action) => {
      if (action === 'start') {
        this.startGame();
      }
      if (action === 'audio') {
        this.toggleAudio();
      }
    }

    toggleAudio() {
      if (this.state.audioEnabled) {
        this.setState({ audioEnabled: false });
      }
      else {
        this.setState({ audioEnabled: true });
      }
    }

    startGame() {
        if(!this.state.playing){
            this.setState({ playing: true, compsTurn: true, started: true }, () => this.playGame());
        }
        else{
            this.resetGame();
        }
    }

    audioFinished(){
        this.setState({ playingSound: false });
    }

    resetGame(fn=this.startGame){
        this.setState({ 
            gameMoves: [],
            userMoves: [],
            playing: false,
            compsTurn: false,
            playerTurn: false,
            started: false,
            lost: false,
            playerPlayed: false,
            audioEnabled: true,
            playingSound: false,
            currentSound: SOUND_FILES[0], 
        },() => fn());
    }
    toggleControls() {
      if (this.state.compsTurn) {
        for (const item in this.buttonRefs) {
          this.buttonRefs[item].ref.current.disableButton();
        }
        return new Promise(res=>{
            setTimeout(res(),200);
        });
      }else {
        for (const item in this.buttonRefs) {
          this.buttonRefs[item].ref.current.enableButton();
        }
      }
    }

    toggleTurns(fn){
        if(this.state.compsTurn){
            this.setState({compsTurn:false, playerTurn:true, playerPlayed:false}, ()=>fn());
        } else{
            this.setState({compsTurn:true, playerTurn:false}, ()=>fn());
        }   
    }

    playGame = async ()=> {
      if (this.state.compsTurn && this.state.playing) {
        this.setState({ userMoves: [] });
        await this.toggleControls()
        const number = this.generateNumber();
        this.setState({ gameMoves: [...this.state.gameMoves, number] }, async () => {
            await this.playCompMoves();
            this.toggleTurns(this.toggleControls);
            this.playerTurnTimer();
        });
      }
    }

    async playCompMoves() {
      for (let i = 0; i < this.state.gameMoves.length; i++) {
        const colorIndex = this.state.gameMoves[i];
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
                (()=>{
                this.buttonRefs[colorIndex].ref.current.autoClick();
                this.playSound(this.colors[colorIndex])})()
            )}, this.timeBetweenPCMoves);
        });
      }
      return new Promise(res=>{
          res();
      });
    }

    checkPlayerMoves() {
      for (let i = 0; i < this.state.userMoves.length; i++) {
        if (this.state.gameMoves[i] !== this.state.userMoves[i]) {
          return this.gameOver();
        }
      }
      console.log('Nice job!');
      if (this.state.userMoves.length === this.state.gameMoves.length) {
        this.setState({ playerPlayed: true }, () => {
          this.toggleControls();
          this.toggleTurns(this.playGame);
        });
      }
    }

    gameOver() {
      console.log('WRONG!');
      console.log(`PC moves: ${console.dir(this.state.gameMoves)}`);
      console.log(`Your moves: ${console.dir(this.state.userMoves)}`);
      this.setState({
        playing: false,
        lost: true,
      });
    }

    //fix this horrible abomination
    playerTurnTimer = () => {
      setTimeout(() => {
        if (!this.state.playerPlayed && this.state.playerTurn) {
          console.log('You didn\'t play');
        }
      }, 3000);
    }

    generateNumber=() => Math.floor(Math.random() * (this.buttonRefs.length));


    render() {
      return (
          <div id="main__simon__game__container">
              <div id="main__simon__game__container__center">
              <span>SIMON</span>
              <div id="main__simon__game__container__center__controls__display">{this.state.gameMoves.length}</div>
              <ReactHowler src={[`sounds/${this.state.currentSound}`]} playing={ this.state.playingSound }  html5/>
            </div>
              <div id="main__simon__game__container__center__controls__container">
              <GameControls controlClick={this.handleControlClick} />
            </div>
              <div id="main__simon__game__container__buttons">
              <GameButton onClick = {this.handleButtonClick} color = {this.colors[0]}  buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[0].ref} />
              <GameButton onClick = {this.handleButtonClick} color = {this.colors[1]}  buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[1].ref} />
              <GameButton onClick = {this.handleButtonClick} color = {this.colors[2]}  buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[2].ref} />
              <GameButton onClick = {this.handleButtonClick} color = {this.colors[3]}  buttonDelay = {this.buttonDelayTime} ref={this.buttonRefs[3].ref} />
            </div>
            </div>
      );
    }
}

export default SimonGame;
