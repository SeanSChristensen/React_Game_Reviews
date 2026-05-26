import { Button } from 'bootstrap';
import { FaStar } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { SubmitButton } from "../components/submitButton";
import postDataWithStatus from "../services/api/POST";
import STATUS from "../services/api/status";


async function ApiFetchHandler(url, requestHeaders, requestBody) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: requestHeaders,
            body: JSON.stringify(requestBody)
        })
        const result = await response.json()
        if (response.ok) {
            return { loading: false, data: result.data , error: null}
        }
        else {
            return { loading: false, data: null, error: result.error }
        }
    } catch (e) {
        console.log(e)
        return { loading: false, data: null, error: "network error" }
    }
}

export default function ReviewPage() {
    const { gameName } = useParams();

    const [gameInfo, setGameInfo] = useState({ loading: true, data: null, error: null });

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [commentPage, setCommentPage] = useState(1);
    const [comments, setComments] = useState({ loading: true, data: null, error: null });

    const [apiPostLoading, setApiPostLoading] = useState(STATUS.IDLE);

    const handlePostRequest = async () => {
        postDataWithStatus(
            `http://localhost:3000/rating`,
            setApiPostLoading,
            { rating: rating, game_id: gameInfo.data.game_id },
            {
                'Content-Type': 'application/json',
                token: localStorage.getItem("token")
            })
    }

    const pageUp = async (e) => {
        e.preventDefault();
        setComments({ loading: true, data: null, error: null })
        setCommentPage(commentPage + 1)
    };

    const pageDown = async (e) => {
        e.preventDefault();
        setComments({ loading: true, data: null, error: null })
        setCommentPage(commentPage - 1)
    };


    useEffect(() => {
        async function loadGameInfo() {
            const result = await ApiFetchHandler(
                `http://localhost:3000/api/gameInfo/${gameName}`,
                {
                    token: localStorage.getItem("token")
                }
            )

            setGameInfo(result)
        }

        loadGameInfo()
    }, [gameName])

    useEffect(() => {
        async function loadCommentInfo() {
            const result = await ApiFetchHandler(
                `http://localhost:3000/api/comments`,
                {
                    'game_id': gameInfo.data.game_id,
                    'page': commentPage,
                    token: localStorage.getItem("token")
                }
            )
            setComments(result)
        }

        if (gameInfo.data) {
            loadCommentInfo()
        }
    }, [commentPage, gameInfo])


    let content;

    if (gameInfo.loading) content =
        <div className="gameInfoBox">
            <div className="text-center gameInfoLoadingSpinner">
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        </div>;
    else if (gameInfo.error) {
        content =
            <div>
                <p>{gameInfo.error}</p>
            </div>
    }
    else {
        const timestamp = gameInfo.data.release_date;
        const formattedDate = new Date(timestamp).toLocaleString("en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })

        content =
            <div className="gameInfoBox">
                <h1 className='gameTitle'>{gameName}</h1>
                <div className="gameAverageRating">
                <h3>Average Rating</h3>
                    {[...Array(5)].map((star, index, rating) => {
                        index += 1;
                        rating = 3;
                        return (
                            <FaStar
                            key={index}
                            size={30}
                            className={index <= (hover || rating) ? 'on' : 'off'}
                            color={index <= (hover || rating) ? '#ffd700' : '#e4e5e9'}/>
                    );
                })}</div>
                <div className='gameInformation'>
                    <p><strong>Release Date:</strong> {formattedDate}</p>
                    <p><strong>Publisher:</strong> {gameInfo.data.publisher}</p>
                    <p><strong>Development Studio:</strong> {gameInfo.data.development_studio}</p>

                    <p><strong>Summary:</strong></p>
                    <p>{gameInfo.data.summary}</p></div>

                {apiPostLoading === STATUS.SUCCESS ? (
                    <p className="submittedText" >Submitted!</p>
                ) : (
                    <><div className="star-rating">
                        {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                                <FaStar
                                    key={index}
                                    className={index <= (hover || rating) ? 'on' : 'off'}
                                    onClick={() => setRating(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(rating)}
                                    size={30}
                                    color={index <= (hover || rating) ? '#ffd700' : '#e4e5e9'} />
                            );
                        })}
                        </div>
                            <SubmitButton disabled={apiPostLoading === STATUS.SUBMITTING} value={apiPostLoading === STATUS.SUBMITTING ? "Submitting..." : "Submit"} formSubmitFunction=
                                {handlePostRequest}
                                cssClasses={"buttonCenter"} />
                            {apiPostLoading === STATUS.ERROR && <p className="submitErrorMessage" >Sorry something went wrong with submitting your rating, please try again or contact system administrator</p>}
                    </>
                )}
                {!comments.loading
	                ? !comments.error
                        ? (<div className="commentsGrid" style={{ padding: 20 }}>
                            {comments.data.rows.map((item) => (
                                <><div class="card border-light mb-3 commentCards">
                                    <div class="card-header">01/01/2000</div>
                                    <div class="card-body">
                                        <h5 class="card-title">{item.text}</h5>
                                        <p class="card-text">User1</p>
                                    </div>
                                </div>
                                </>
                            ))}
                            {commentPage != 1 ? (<button onClick={pageDown} disabled={comments == null}>
                                Previous
                            </button>) : (<div></div>)}
                            <span> Page {commentPage} </span>
                            {comments.data.nextPage == true ? (<button onClick={pageUp} disabled={comments == null}>
                                Next
                            </button>) : (<div></div>)}
                        </div>)
                        : <p className="commentsLoadingErrorMessage">Sorry something went wrong loading comments, please contact the system administrator</p>
                    : <div class="text-center commentLoadingSpinner">
                        <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                }
            </div>

    }

    return (
        <Layout>
            {content}
        </Layout>
    )
}