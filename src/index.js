import React from 'react';
import ReactDOM from 'react-dom';

const App = ()=>{
    return (
    <div id="main__simon__game__container">
        <div id="main__simon__game__container__center"></div>
        <div id="main__simon__game__container__buttons">
            <div id="main__simon__game__container__buttons__red"></div>
            <div id="main__simon__game__container__buttons__green"></div>
            <div id="main__simon__game__container__buttons__blue"></div>
            <div id="main__simon__game__container__buttons__yellow"></div>
        </div>
    </div>
    );
}

ReactDOM.render(<App/>,document.querySelector('#root'));