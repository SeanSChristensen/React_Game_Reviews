import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';


const Layout = ({ children }) => {
    let firstName = localStorage.getItem("first_name");
    let lastName = localStorage.getItem("last_name");
    let isLoggedIn = false

    if (firstName == null || lastName == null) {
        firstName = ""
        lastName= ""
        isLoggedIn = true
    }

    return (
        <>
            <nav class="navbar navbar-expand-lg bg-body-tertiary" id="customNavBar">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link active NavBarLink" aria-current="page" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link NavBarLink" href="/search">Search</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link NavBarLink" href="/about">About </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link NavBarLink" href="/list">List </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link NavBarLink" href="/register">Register </a>
                            </li>
                            {isLoggedIn
                                ?<><li class="nav-item">
                                <a class="nav-link NavBarLink" href="/login">Login </a>
                                </li></>
                                : <></>}
                        </ul>
                        <span className="navbar-text ms-auto navBarName">
                            {firstName + " " + lastName}
                        </span>
                    </div>
                </div>
            </nav>
            <main class="mainBody">{children}</main>
        </>
    )
}

export default Layout;