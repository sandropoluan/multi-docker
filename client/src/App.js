import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
   <Router>
      <div className="App">
        <div>learn react</div>
      <div>
        <Route exact path="/" component={Fib}/>
        <Route exact path="/otherpage" component={OtherPage}/>
      </div>
    </div>
   </Router>
  );
}

export default App;
