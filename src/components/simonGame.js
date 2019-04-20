import React, { Component } from 'react';
import ReactHowler from 'react-howler';
import GameButton from './gameButton';
import { SOUND_FILES } from '../sounds';
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
      keyTimers: [],
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
      this.resetGame = this.resetGame.bind(this);
      this.soundColorMap = {
          'red':0,
          'green':1,
          'blue':2,
          'yellow':3
      }
    }

    handleButtonClick(color){
      const choiceIndex = this.colors.indexOf(color);
      this.clearTimers();
      this.setState({ userMoves: [...this.state.userMoves, choiceIndex], playerPlayed:true }, () => {
        this.playSound(color);
        this.checkPlayerMoves();
      });
    }

    clearTimers(){
        this.setState({ keyTimers: [] });
    }

    playSound(color){
        if(this.state.audioEnabled && this.state.playing){
            let soundIndex = this.soundColorMap[color] || this.soundColorMap['red'];
            this.setState({ currentSound:SOUND_FILES[soundIndex], playingSound: true });
        } else{
            this.setState({ playingSound:false });
        }
    }

    handleControlClick = (action) => {
      if (action === 'start'){
        this.startGame();
      }
      if (action === 'audio'){
        this.toggleAudio();
      }
      if (action === 'reset'){
          this.resetGame();
      }
    }

    toggleAudio() {
      if (this.state.audioEnabled){
        this.setState({ audioEnabled: false });
      }
      else{
        this.setState({ audioEnabled: true });
      }
    }

    startGame() {
        if(!this.state.playing && !this.state.lost){
            this.setState({ currentSound: SOUND_FILES })
            this.setState({ playing: true, compsTurn: true, started: true }, () => this.playGame());
        }
        else if(!this.state.lost){
            this.resetGame();
        }
    }

    audioFinished(){
        this.setState({ playingSound: false });
    }

    resetGame(){
        this.killButtons();
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
        });
        this.resetButtons();
    }

    resetButtons(){
        let targets = this.buttonRefs
        for(const item in targets){
            targets[item].ref.current.resetButton();
        }
    }

    toggleControls(){
      if (this.state.compsTurn){
        for (const item in this.buttonRefs){
          this.buttonRefs[item].ref.current.disableButton();
        }
        return new Promise(res => {
            setTimeout(res(),200);
        });
      }else {
        for (const item in this.buttonRefs){
          this.buttonRefs[item].ref.current.enableButton();
        }
      }
    }

    toggleTurns(fn){
        if(this.state.compsTurn){
            this.setState({compsTurn:false, playerTurn:true, playerPlayed:false}, () => fn());
        } else{
            this.setState({compsTurn:true, playerTurn:false}, () => fn());
        }   
    }

    killButtons(){
        for (const item in this.buttonRefs){
            this.buttonRefs[item].ref.current.killButton();
        }
    }

    playGame = async () => {
      if (this.state.compsTurn && this.state.playing){
        this.setState({ userMoves: [] });
        await this.toggleControls()
        const number = this.generateNumber();
        this.setState({ gameMoves: [...this.state.gameMoves, number] }, async () => {
            await new Promise(res=>setTimeout(() => res(), 500));
            await this.playCompMoves();
            this.toggleTurns(this.toggleControls);
            this.playerTurnTimer();
        });
      }
    }

    async playCompMoves(){
      for (let i = 0; i < this.state.gameMoves.length; i++){
          if(this.state.playing){
            const colorIndex = this.state.gameMoves[i];
            await new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    (() => {
                        if(this.state.playing){
                            this.buttonRefs[colorIndex].ref.current.autoClick();
                            this.playSound(this.colors[colorIndex])
                        }
                    })()
                )}, this.timeBetweenPCMoves);
            });
        }else{
            break;
        }
    }
      return new Promise(res => {
          res();
      });
    }

    checkPlayerMoves(){
      for (let i = 0; i < this.state.userMoves.length; i++){
        if (this.state.gameMoves[i] !== this.state.userMoves[i]){
          return this.gameOver();
        }
      }
      this.setState({ playerPlayed: false });
      if (this.state.userMoves.length === this.state.gameMoves.length){
          this.toggleControls();
          this.toggleTurns(this.playGame);
      }else{
        this.playerTurnTimer();
      }
    }

    gameOver(){
      this.setState({
        playing: false,
        lost: true,
        currentSound:SOUND_FILES[4]
      }, () => setTimeout( () => this.setState({ lost:false }, this.resetGame()), 2000));
      
    }

    playerTurnTimer = () => {
      let id = setTimeout(() => {
        if (!this.state.playerPlayed && this.state.playerTurn){
            this.checkKeyTimer(id);
        }
      }, 2000);
      this.setState({ keyTimers: [...this.state.keyTimers, id] });
    }

    checkKeyTimer(id){
        if(this.state.keyTimers.indexOf(id) !== -1){
            this.gameOver();
        }
    }
    generateNumber= () => Math.floor(Math.random() * (this.buttonRefs.length));


    render(){
      return (
          <div id="main__simon__game__container">
            <div id="main__simon__game__container__center">
                <span>SIMON</span>
                <div id="main__simon__game__container__center__controls__display">{ this.state.gameMoves.length }</div>
                <ReactHowler src={ [`sounds/${this.state.currentSound}`] } playing={ this.state.playingSound }  html5 ref={ this.howlerRef }/>
            </div>
                <div id="main__simon__game__container__center__controls__container">
                    <GameControls controlClick={ this.handleControlClick } />
                </div>
            <div id="main__simon__game__container__buttons">
                <GameButton onClick = { this.handleButtonClick } color = { this.colors[0] }  buttonDelay = { this.buttonDelayTime } ref={ this.buttonRefs[0].ref } />
                <GameButton onClick = { this.handleButtonClick } color = { this.colors[1] }  buttonDelay = { this.buttonDelayTime } ref={ this.buttonRefs[1].ref } />
                <GameButton onClick = { this.handleButtonClick } color = { this.colors[2] }  buttonDelay = { this.buttonDelayTime } ref={ this.buttonRefs[2].ref } />
                <GameButton onClick = { this.handleButtonClick } color = { this.colors[3] }  buttonDelay = { this.buttonDelayTime } ref={ this.buttonRefs[3].ref } />
            </div>
        </div>
      );
    }
}

export default SimonGame;
