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
      keyTimers: [], //tracks the timeout ids for player button presses. This prevents incorrect "loss of game"
    };

    constructor() {
      super();
      this.colors = ['red', 'green', 'blue', 'yellow'];

      //Time in ms for the button to remain active after clicking
      this.buttonDelayTime = 500;
      //Time in ms between the playing of each computer move
      this.timeBetweenPCMoves = 800;
      //Refs for our game buttons
      this.buttonRefs = [
        { id: 0, ref: React.createRef() },
        { id: 1, ref: React.createRef() },
        { id: 2, ref: React.createRef() },
        { id: 3, ref: React.createRef() },
      ];
      this.howlerRef = React.createRef();
      //This maps the button color to the correct sound in our sound file
      this.soundColorMap = {
          'red':0,
          'green':1,
          'blue':2,
          'yellow':3
      };
    }

    //When the user presses a button, the color is passed from the component
    //We get the index of the color from our this.colors
    //this index value is pushed to the user moves array so we can track
    //what moves the user made. Then, state is updated to track that the
    //player did play. The sound for the color is played and finally,
    //the player move is checked against what the computer played 
    //in the previous round of play. This part happens after the state is
    //updated via the callback to avoid issues.
    handleButtonClick = color => {
      const choiceIndex = this.colors.indexOf(color);
      this.clearTimers();
      this.setState({ userMoves: [...this.state.userMoves, choiceIndex], playerPlayed:true }, () => {
        this.playSound(color);
        this.checkPlayerMoves();
      });
    }

    

    //The color of the pressed button is passed
    //If we are allowing sound to be played,
    //the color is used to find the sound file index from
    //the color map. The state is updated to the correct sound.
    playSound = color => {
      if(this.state.audioEnabled && this.state.playing){
          let soundIndex = this.soundColorMap[color];
          this.setState({ currentSound:SOUND_FILES[soundIndex], playingSound: true });
      } 
    }

    //This handles the clicking of our control buttons (Mute, Reset, Start)
    //an action is taken based on which button is pressed
    handleControlClick = action => {
      switch(action){
        case 'start':
          this.startGame();
          break;
        case 'audio':
          this.toggleAudio();
          break;
        case 'reset':
          this.resetGame();
          break;
        default:
          break;
      }
    }

    //Well, it toggles the audio mate
    //If we are muting the sound, then set the current sound to null so
    //nothing is played and make sure we aren't playing any sound homie.
    toggleAudio = () => {
      if (this.state.audioEnabled){
        this.setState({ audioEnabled: false , currentSound:null , playingSound: false });
      }
      else{
        this.setState({ audioEnabled: true });
      }
    }

    //Start the game ma dude
    //If the player is a quitter, then this button resets the game
    startGame = () => {
      if(!this.state.playing && !this.state.lost){
          this.setState({ playing: true, compsTurn: true, started: true }, () => this.playGame());
      }
      else if(!this.state.lost){
          this.resetGame();
      }
    }

    //Disables all buttons
    //Resets us to default state
    //Resets the buttons to default
    resetGame = () => {
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

    //Reset dem buttons yo
    resetButtons = () => {
      let targets = this.buttonRefs;
      for(const item in targets){
          targets[item].ref.current.resetButton();
      }
    }

    //If this computer is playing
    //disable dem damn buttons
    //We have a timeout in there to make sure
    //all those buttons cannot be pressed by
    //the pesky user and break ma game.
    //If it's time for the user to play
    //enable those buttons fam
    toggleControls = () => {
      if (this.state.compsTurn){
        for (const item in this.buttonRefs){
          this.buttonRefs[item].ref.current.disableButton();
        }
        return new Promise(res => {
            setTimeout(res(), 200);
        });
      }else{
        for (const item in this.buttonRefs){
          this.buttonRefs[item].ref.current.enableButton();
        }
      }
    }

    //Who is playing?
    //If it's the computer, then the player isn't playing now are they?
    toggleTurns = fn => {
      if(this.state.compsTurn){
          this.setState({ compsTurn:false, playerTurn:true, playerPlayed:false }, () => fn());
      } else{
          this.setState({ compsTurn:true, playerTurn:false }, () => fn());
      }   
    }

    //Completely break all game buttons
    //used to lock out the user during reset
    killButtons = () => {
      for (const item in this.buttonRefs){
          this.buttonRefs[item].ref.current.killButton();
      }
    }

    //If the computer is playing,
    //Clear the users previous moves
    //because they do not matter any more
    //Wait for the controls to be disabled
    //Generate a number so the computer can play
    //update the computer's move array
    //after state is updated, give us some time
    //to breathe so everything is running smooth
    //then play the computer's moves to the user
    //let the user push some buttons again
    //start the turn timer for the player to
    //see if they are bad and should lose
    playGame = async () => {
      if (this.state.compsTurn && this.state.playing){
        this.setState({ userMoves: [] });
        await this.toggleControls();
        const number = this.generateNumber();
        this.setState({ gameMoves: [...this.state.gameMoves, number] }, async () => {
            await new Promise(res => setTimeout(() => res(), 500));
            await this.playCompMoves();
            this.toggleTurns(this.toggleControls);
            this.playerTurnTimer();
        });
      }
    }

    //Display the computer's moves to the user
    //Get the color index based on what number
    //the pc played. Send the auto click action to
    //the correct button and play the sound for
    //the button. This is done via a promise so we
    //can use async / await to pause code execution.
    //In order to complete this task within the resolve
    //function, and IIFE had to be used because JavaScript
    //DEMANDED a "function" to be executed within the resolver
    //and apparently arrow "functions" aren't good enough
    //for the resolver function and I didn't want to bind 
    //the this context inside of the resolver function because
    //that looked hideous so I had to use an arrow function
    //with an IIFE to appease the resolver function
    playCompMoves = async () => {
      for (let i = 0; i < this.state.gameMoves.length; i++){
        if(this.state.playing){
          const colorIndex = this.state.gameMoves[i];
          await new Promise((resolve) => {
          setTimeout(() => {
              resolve(
                  (() => {
                      if(this.state.playing){
                          this.buttonRefs[colorIndex].ref.current.autoClick();
                          this.playSound(this.colors[colorIndex]);
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

  //If the player moves array is not the same length
  //as the computer moves array then the user turn
  //must not be over. In that case, check the user move
  //against the same index of the computer array. If the
  //player is bad and they should feel bad, then they lose
  //Otherwise, update the state to playerPlayed: false
  //So we know this current button press is over and we
  //can restart their turn timer.
  checkPlayerMoves = () => {
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

  //You suck
  gameOver = () => {
    this.setState({
      playing: false,
      lost: true,
      currentSound:SOUND_FILES[4]
    }, () => setTimeout(() => this.setState({ lost:false }, this.resetGame()), 2000));
  }

  //Fire off a setTimeout and capture the
  //timer id. When the async function completes,
  //If the player has not played AND it is their turn
  //Check for the timer id in our tracker array
  playerTurnTimer = () => {
    let id = setTimeout(() => {
      if (!this.state.playerPlayed && this.state.playerTurn){
          this.checkKeyTimer(id);
      }
    }, 2000);
    this.setState({ keyTimers: [...this.state.keyTimers, id] });
  }

  //Check if the timer id for the player's turn
  //is still inside of our timer array. If it
  //is, well guess what buddy, you suck AND 
  //you lose.
  checkKeyTimer = id => {
    if(this.state.keyTimers.indexOf(id) !== -1){
        this.gameOver();
    }
  }

  //This clears our array which tracks the setTimeout ids
  //for each button press from the user
  //These timers are used to determine if the player
  //has allowe their turn to expire. If so, they lose.
  clearTimers = () => {
    this.setState({ keyTimers: [] });
  }

  //Bet you can't figure out what this does
  generateNumber = () => Math.floor(Math.random() * (this.buttonRefs.length));

  //Well, it makes stuff appear on the screen
  //If you are wondering about the ReactHowler component
  //and why it needs 827420 different audio formats,
  //well, you can thank Apple and Google for that.
  //Apparently we can't decide on a universal audio
  //format so that crap has to happen and bloats
  //my project size. Thanks Apple and Google.
  render = () => {
    return (
        <div id="main__simon__game__container">
          <div id="main__simon__game__container__center">
              <span>SIMON</span>
              <div id="main__simon__game__container__center__controls__display">{ this.state.gameMoves.length }</div>
              <ReactHowler src={ [`${process.env.PUBLIC_URL}/sounds/${this.state.currentSound}.ogg`,
              `${process.env.PUBLIC_URL}/sounds/${this.state.currentSound}.mp3`, `${process.env.PUBLIC_URL}/sounds/${this.state.currentSound}.webm` ] } playing={ this.state.playingSound } ref={ this.howlerRef }/>
          </div>
              <div id="main__simon__game__container__center__controls__container">
                  <GameControls controlClick={ this.handleControlClick } muted={this.state.audioEnabled}/>
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
