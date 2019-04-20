import React, { Component } from 'react';

class gameButton extends Component {
    state = {
      activated: false,
      enabled: false,
      alive: true
    }

    constructor({ color = 'red', onClick = () => { throw new Error('Click handler is not set in game button') }, 
        buttonDelay = 500, sound = 'beep_one.ogg', audioEnabled = true }) {
      super();
      this.sound = sound;
      this.buttonDelay = buttonDelay;
      this.onClick = onClick;
      this.color = color;
      this.buttonRef = React.createRef();
      this.audioEnabled = audioEnabled;
      this.buttonClasses = ['inactive__button', 'active__button'];
    }

    handleClick = () => {
      if (!this.state.active && this.state.enabled){
        this.setState({ activated: true });
        this.clearActive();
        this.onClick(this.color);
      }
    }

    enableButton(){
        this.setState({ enabled: true });
    }

    disableButton(){
        this.setState({ enabled: false });
    }

    async autoClick(){
      this.setState({ activated: true });
      await this.clearActive();
      return new Promise(resolve => resolve());
    }

    clearActive(){
      return new Promise((resolve) => {
        setTimeout(() => {
          this.setState({ activated: false });
          resolve();
        }, this.buttonDelay);
      });
    }

    killButton(){
        this.setState({ activated: false, enabled: false, alive: false });
        this.buttonRef.current.className = this.buttonClasses[0];
    }

    resetButton(){
        this.setState({ alive:true });
    }
    componentDidMount(){
        if(this.state.alive){
            this.updateButtonClass();
        }
    }

    componentDidUpdate(){
        if(this.state.alive){
            this.updateButtonClass();
        }
    }

    updateButtonClass(){
      this.state.activated ? this.buttonRef.current.className = this.buttonClasses[1] : this.buttonRef.current.className = this.buttonClasses[0];
    }

    render(){
      return (
          <div ref={ this.buttonRef } id={ `main__simon__game__container__buttons__${this.color}` } onClick={ this.handleClick }/>
      );
    }
}

export default gameButton;
