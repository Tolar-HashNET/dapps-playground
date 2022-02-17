import React, { Component } from 'react';
import './style.css';
import App from './../App';
import LandingPage from './../LandingPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

class AppRouter extends Component {
  render() {
    return (
        <div>
        <nav className="container navbar pure-menu pure-menu-horizontal">
            <Router>
                <div>
                    <Link to="/" className='enter-button-market'>
                        Lottery
                    </Link>
                    <Link to="/dapp2" className='enter-button-market'>
                        2nd DAPP
                    </Link>
                    <Routes>
                        <Route exact path="/" element={<App />}/>
                        <Route exact path="/dapp2" element={<LandingPage />}/>
                    </Routes>
                </div>
            </Router>
        </nav>
        </div>
    );
  }
}

export default AppRouter;