import React, {useState} from 'react';
import GameButton from './gameButton';
import {SOUND_FILES} from '../sounds';

const SimonGame = () => {

    const [moves, setMoves] = useState({gameMoves:[], userMoves:[]});
    const colors = ['red', 'green', 'blue', 'yellow'];
    const buttonDelayTime = 500;

    const handleButtonClick = (color) => {
        // console.log(`You clicked the ${color} button!`);
    }

    return (
        <div id="main__simon__game__container">
        <div id="main__simon__game__container__center"/>
        <div id="main__simon__game__container__buttons">
            <GameButton onClick={handleButtonClick} color={colors[0]} sound={SOUND_FILES[0]} buttonDelay = {buttonDelayTime}/>
            <GameButton onClick={handleButtonClick} color={colors[1]} sound={SOUND_FILES[1]} buttonDelay = {buttonDelayTime}/>
            <GameButton onClick={handleButtonClick} color={colors[2]} sound={SOUND_FILES[2]} buttonDelay = {buttonDelayTime}/>
            <GameButton onClick={handleButtonClick} color={colors[3]} sound={SOUND_FILES[3]} buttonDelay = {buttonDelayTime}/>
        </div>
    </div>
    );
}

export default SimonGame;