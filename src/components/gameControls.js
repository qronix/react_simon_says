import React from 'react';

 function GameControl(props){
     
    //guess what this does
     const handleClick = (action) => {
         props.controlClick(action);
     }

    return(
    <div id="main__simon__game__container__center__controls__container__buttons">
        <div className="main__simon__game__container__center__controls__container__buttons__container">
            <label htmlFor="main__simon__game__container__center__controls__container__buttons--audio">{props.muted ? 'Mute' : 'Unmute'}</label>
            <div id="main__simon__game__container__center__controls__container__buttons--audio" onClick={ () => handleClick('audio') }></div>
        </div>
        <div className="main__simon__game__container__center__controls__container__buttons__container">
            <label htmlFor="main__simon__game__container__center__controls__container__buttons--reset">Reset</label>
            <div id="main__simon__game__container__center__controls__container__buttons--reset" onClick={ () => handleClick('reset') }></div>
        </div>
        <div className="main__simon__game__container__center__controls__container__buttons__container">
            <label htmlFor="main__simon__game__container__center__controls__container__buttons--start">Start</label>
            <div id="main__simon__game__container__center__controls__container__buttons--start" onClick={ () => handleClick('start') }></div>
        </div>
    </div>
    );
}

export default GameControl