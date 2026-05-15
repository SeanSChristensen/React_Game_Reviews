import Layout from "../components/Layout";
import React, { useState, useEffect } from 'react';

export default function List() {
    const [gameList, setGameList] = useState(null);
    const [gameListLoadingStatus, setGameListLoadingStatus] = useState("loading");

    useEffect(() => {
        fetch(`http://localhost:3000/api/gameList`)
            .then(response => response.json())
            .then(json => {
                if (json.status == "error") {
                    setGameListLoadingStatus("error")
                }
                else {
                    setGameList(json)
                    setGameListLoadingStatus("success")
                }
            })
    })

    return (
        <Layout>
            <div className="gamesList">
                <h2>Games List</h2>
                <p>List of current game pages</p>
                {gameListLoadingStatus == "error loading game list please contact system administrators"
                    ? (<p>Error</p>)
                    : gameListLoadingStatus == "loading"
                        ? (<div class="text-center">
                            <div class="spinner-border" role="status">
                                <span class="sr-only"></span>
                            </div>
                        </div>)
                        : <ul>{gameList.data.map((gameName) => (<li><a href={`http://localhost:5173/Review/${gameName.name}`}>{gameName.name}</a></li>))}
                        </ul>}

            </div>
        </Layout>
    )
}