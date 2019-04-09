import React, {useState, useEffect, useRef} from 'react';

const gameButton = (props) => {

    const buttonRef = useRef(null);
    const [active, setActive] = useState({activated:false});
    const buttonClasses = ['inactive__button', 'active__button'];

    const handleClick = () => {
        let state = {...active, activated:true};
        setActive(state);
        console.log(state);
        clearActive();
        props.onClick(props.color);
    }
    const clearActive = () => {
            setTimeout(()=>{
                let state = {...active, activated:false};
                setActive(state);
            },1000);
    }

    useEffect(()=>{
        updateButton();
        console.log(`This button is active: ${console.dir(active)}`);
    });

    const updateButton = () =>{
        active.activated ? buttonRef.current.className = buttonClasses[1] :  buttonRef.current.className = buttonClasses[0];
    }
    return <div ref={buttonRef} id={`main__simon__game__container__buttons__${props.color}`} onClick={handleClick}/>;
}

export default gameButton;