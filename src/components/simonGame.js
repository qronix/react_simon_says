import React, {useState} from 'react';
import GameButton from './gameButton';

const SimonGame = () => {

    const [moves, setMoves] = useState({gameMoves:[], userMoves:[]});
    const colors = ['red', 'green', 'blue', 'yellow'];

    const handleButtonClick = (color) => {
        // console.log(`You clicked the ${color} button!`);
    }

    return (
        <div id="main__simon__game__container">
        <div id="main__simon__game__container__center"></div>
        <div id="main__simon__game__container__buttons">
            <GameButton onClick={handleButtonClick} color={colors[0]}/>
            <GameButton onClick={handleButtonClick} color={colors[1]}/>
            <GameButton onClick={handleButtonClick} color={colors[2]}/>
            <GameButton onClick={handleButtonClick} color={colors[3]}/>
        </div>
    </div>
    );
}

export default SimonGame;