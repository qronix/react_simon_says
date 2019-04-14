import React, {Component} from 'react';
import ReactHowler from 'react-howler';

class gameButton extends Component {
    
    state = {
        activated:false,
        enabled:false
    }

    constructor({color, onClick, buttonDelay, sound, audioEnabled}){
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
        if(!this.state.active && this.state.enabled){
            this.setState({activated:true});
            this.clearActive();
            this.onClick(this.color);
        }
    }

    enableButton(){
        this.setState({enabled:true});
    }

    disableButton(){
        this.setState({enabled:false});
    }
    async autoClick(){
        this.setState({activated:true});
        await this.clearActive();
        return new Promise(resolve=>resolve());
    }
    clearActive(){
        return new Promise(resolve=>{
            setTimeout(()=>{
                this.setState({activated:false});
                resolve();
            },this.buttonDelay);
        })
    }

    componentDidMount (){
        this.updateButtonClass();
    }

    componentDidUpdate (){
        this.updateButtonClass();
    }

    updateButtonClass(){
        this.state.activated ? this.buttonRef.current.className = this.buttonClasses[1] :  this.buttonRef.current.className = this.buttonClasses[0];
    }
    render(){
        return (
            <div ref={this.buttonRef} id={`main__simon__game__container__buttons__${this.color}`} onClick={this.handleClick}>
                <ReactHowler src={[`sounds/${this.sound}`]} playing={(this.state.activated && this.audioEnabled)} html5={true}/>
            </div>
        );
    }
}

export default gameButton;