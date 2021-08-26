import React, { Component } from 'react';

class gameButton extends Component {
  state = {
    activated: false,
    enabled: false,
    alive: true,
  };

  constructor({
    color = 'red',
    onClick = () => {
      throw new Error('Click handler is not set in game button');
    },
    buttonDelay = 500,
    sound = 'beep_one.ogg',
    audioEnabled = true,
  }) {
    super();
    this.sound = sound;
    this.buttonDelay = buttonDelay;
    this.onClick = onClick;
    this.color = color;
    this.buttonRef = React.createRef();
    this.audioEnabled = audioEnabled;
    this.buttonClasses = ['inactive__button', 'active__button'];
  }

  // handleClick = () => {
  //   if (!this.state.active && this.state.enabled){
  //     this.setState({ activated: true });
  //     this.clearActive();
  //     //sends the color to the parent component
  //     this.onClick(this.color);
  //   }
  // }

  enableButton() {
    this.setState({ enabled: true });
  }

  disableButton() {
    this.setState({ enabled: false });
  }

  //Activate the button
  //Wait for it to become inactive (light-up)
  //Resolve back to parent component
  async autoClick() {
    this.setState({ activated: true });
    await this.clearActive();
    return new Promise((resolve) => resolve());
  }

  //Brief delay to show the button
  //activity to the user
  clearActive() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ activated: false });
        resolve();
      }, this.buttonDelay);
    });
  }

  //All buttons must die
  killButton() {
    this.setState({ activated: false, enabled: false, alive: false });
    this.buttonRef.current.className = this.buttonClasses[0];
  }

  resetButton() {
    this.setState({ alive: true });
  }

  //This one was all me
  //See that lifecycle method,
  //I made it, not Dan Abramov
  componentDidMount() {
    if (this.state.alive) {
      this.updateButtonClass();
    }
  }

  //This one too, all me
  componentDidUpdate() {
    if (this.state.alive) {
      this.updateButtonClass();
    }
  }

  //Almost sounds like
  //a lifestyle method am I right?
  updateButtonClass() {
    this.state.activated
      ? (this.buttonRef.current.className = this.buttonClasses[1])
      : (this.buttonRef.current.className = this.buttonClasses[0]);
  }

  //Makes things
  render() {
    return (
      <div
        ref={this.buttonRef}
        id={`main__simon__game__container__buttons__${this.color}`}
        onClick={this.handleClick}
      />
    );
  }
}

export default gameButton;
