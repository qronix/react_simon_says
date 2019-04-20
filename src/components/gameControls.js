import React from 'react';

 function GameControl(props){
     const handleClick = (action) => {
         props.controlClick(action)
     }
    return(
    <div id="main__simon__game__container__center__controls__container__buttons">
        <div id="main__simon__game__container__center__controls__container__buttons--audio" onClick={ () => handleClick('audio') }></div>
        <div id="main__simon__game__container__center__controls__container__buttons--reset" onClick={ () => handleClick('reset') }></div>
        <div id="main__simon__game__container__center__controls__container__buttons--start" onClick={ () => handleClick('start') }></div>
    </div>
    );
}

export default GameControl