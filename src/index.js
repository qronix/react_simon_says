import React from 'react';
import ReactDOM from 'react-dom';
import SimonGame from './components/simonGame';

const App = ()=>{
    return <SimonGame/>;
}

ReactDOM.render(<App/>,document.querySelector('#root'));
