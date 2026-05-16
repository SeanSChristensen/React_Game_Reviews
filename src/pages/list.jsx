import Layout from "../components/Layout";
import React, { useState, useEffect } from 'react';
import setDataFromAPI from "../services/api/GET"

export default function List() {
    const [gameList, setGameList] = useState(null);

    useEffect(() => {
        setDataFromAPI(`http://localhost:3000/api/gameList`, setGameList, {})
    })

    return (
        <Layout>
            <div className="gamesList">
                <h2>Games List</h2>
                <p>List of current game pages</p>
                {gameList == null
                    ? (<div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>)
                    : gameList.status == "error"
                        ? (<p>Error</p>)
                        : <ul>{gameList.data.map((gameName) => (<li><a href={`http://localhost:5173/Review/${gameName.name}`}>{gameName.name}</a></li>))}
                        </ul>}

            </div>
        </Layout>
    )
}