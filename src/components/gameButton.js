import React, {useState, useEffect, useRef} from 'react';
import ReactHowler from 'react-howler';

const gameButton = (props) => {

    const buttonRef = useRef(null);
    const [active, setActive] = useState({activated:false});
    const buttonClasses = ['inactive__button', 'active__button'];

    const handleClick = () => {
        if(!active.activated){
            let state = {...active, activated:true};
            setActive(state);
            clearActive();
            props.onClick(props.color);
        }
    }
    const clearActive = () => {
            setTimeout(()=>{
                let state = {...active, activated:false};
                setActive(state);
            },props.buttonDelay);
    }

    useEffect(()=>{
        updateButton();
    });

    const updateButton = () =>{
        active.activated ? buttonRef.current.className = buttonClasses[1] :  buttonRef.current.className = buttonClasses[0];
    }
    return (
    <div ref={buttonRef} id={`main__simon__game__container__buttons__${props.color}`} onClick={handleClick}>
        <ReactHowler src={[`sounds/${props.sound}`]} playing={active.activated} html5={true}/>
    </div>
    );
}

export default gameButton;