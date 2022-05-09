import React from "react";

function Header() {

    return(

        <>
            <div className='header top-nav'>
                <nav className='navbar navbar-expand-lg navbar-dark row container'>
                    <a className="navbar-brand col-lg-2" href='index.html'><img src="img/icon.png" alt="" /></a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse col-lg-8" id="navbarTogglerDemo02">

                        <ul className="navbar-nav ml-auto navegacion">
                        <li className="nav-item">
                            <a className="nav-link" href="#start">Start</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#tokenomics">Tokenomics</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#whitelist">ICO</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#team">Team</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="whitepaper.html">WhitePaper</a>
                        </li>
                        </ul>

                    </div>

                    <div className='col-lg-2'></div>

                </nav>
            </div>
        </>

    );

}

export default Header;