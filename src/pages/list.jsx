import Layout from "../components/Layout";
import React, { useState, useEffect } from 'react';
import ApiFetchHandler from "../services/api/GET"

export default function List() {
    const [gameList, setGameList] = useState({ loading: true, data: null, error: null });

    useEffect(() => {
        async function loadGameList() {
            const result = await ApiFetchHandler(`http://localhost:3000/api/gameList`)
            setGameList(result)
        }

        loadGameList()
    }, [])

    return (
        <Layout>
            <div className="gamesList">
                <h2>Games List</h2>
                <p>List of current game pages</p>
                {gameList.loading == true
                    ? (<div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>)
                    : gameList.error
                        ? (<p>Error</p>)
                        : <ul>
                            {gameList.data.map((gameName) => (<li><a href={`http://localhost:5173/Review/${gameName.name}`}>{gameName.name}</a></li>))}
                        </ul>}

            </div>
        </Layout>
    )
}