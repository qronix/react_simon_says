import React, {Component} from 'react';
import ReactHowler from 'react-howler';

class gameButton extends Component {
    
    state = {
        activated:false,
        enabled:false
    }

    constructor({color, onClick, buttonDelay, sound}){
        super();
        this.sound = sound;
        this.buttonDelay = buttonDelay;
        this.onClick = onClick;
        this.color = color;
        this.buttonRef = React.createRef();
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
    autoClick(){
        this.setState({activated:true});
        this.clearActive();
        this.onClick(this.color);
    }
    clearActive(){
        setTimeout(()=>{
            this.setState({activated:false});
        },this.buttonDelay);
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
                <ReactHowler src={[`sounds/${this.sound}`]} playing={this.state.activated} html5={true}/>
            </div>
        );
    }
}

export default gameButton;