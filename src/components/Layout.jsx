import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';


const Layout = ({ children }) => {
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
                        </ul>
                    </div>
                </div>
            </nav>
            <main class="mainBody">{children}</main>
        </>
    )
}

export default Layout;