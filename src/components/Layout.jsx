import React from 'react';

const Layout = ({ children }) => {
    return (
        <>
            <div>
                <header>
                    <h1>This is a header</h1>
                    <p>By Sean Christensen</p>
                </header>
            </div>
            <main>{children}</main>
        </>
    )
}

export default Layout;