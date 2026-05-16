import { Button } from 'bootstrap';
import { FaStar } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { SubmitButton } from "../components/submitButton"

const STATUS = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
    SUBMITTING: "submitting"
}

export default function ReviewPage() {
    const { gameName } = useParams();

    const [gameInfo, setGameInfo] = useState(null);
    const [gameInfoLoadingStatus, setGameInfoLoadingStatus] = useState(STATUS.LOADING);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [commentPage, setCommentPage] = useState(1);

    const [comments, setComments] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(STATUS.LOADING);

    const [apiPostLoading, setApiPostLoading] = useState(STATUS.IDLE);


    const handlePostRequest = async () => {
        try {
            setApiPostLoading(STATUS.SUBMITTING);
            const response = await fetch(`http://localhost:3000/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: rating,
                    game_id: gameInfo.data.game_id
                }),
            });
            const result = await response.json();
            if (result.status == STATUS.SUCCESS) {
                setApiPostLoading(STATUS.SUCCESS);
            }
            else {
                setApiPostLoading(STATUS.ERROR);
            }
        } catch (error) {
            setApiPostLoading(STATUS.ERROR);
        }
    };

    const pageUp = async (e) => {
        e.preventDefault();
        setCommentsLoading(STATUS.LOADING)
        setCommentPage(commentPage + 1)
    };

    const pageDown = async (e) => {
        e.preventDefault();
        setCommentsLoading(STATUS.LOADING)
        setCommentPage(commentPage - 1)
    };

    useEffect(() => {
        fetch(`http://localhost:3000/api/gameInfo/${gameName}`)
            .then(response => response.json())
            .then(json => {
                setGameInfo(json);
                setGameInfoLoadingStatus(STATUS.SUCCESS);
            })
    }, []);

    useEffect(() => {
        if (gameInfoLoadingStatus == STATUS.LOADING) { return }
        else if (gameInfo.status == "Game not found" || gameInfo.status == STATUS.ERROR) {
            setCommentsLoading("None")
        }
        else {
            fetch(`http://localhost:3000/api/comments`, {
                method: 'GET',
                headers: {
                    'game_id': gameInfo.data.game_id,
                    'page': commentPage
                }
            })
                .then(response => response.json())
                .then(json => {
                    setComments(json)
                    if (json.status == STATUS.ERROR) {
                        setCommentsLoading(STATUS.ERROR)
                    }
                    else {
                        setCommentsLoading(STATUS.SUCCESS)
                    }

                })
        }
    }
        , [commentPage, gameInfoLoadingStatus]);


    let content;

    if (gameInfoLoadingStatus == STATUS.LOADING) content =
        <div className="gameInfoBox">
            <div class="text-center gameInfoLoadingSpinner">
                <div class="spinner-border" role="status">
                    <span class="sr-only"></span>
                </div>
            </div></div>;
    else if (gameInfo.status == "Game not found") {
        content =
            <div>
                <h1>Game not found</h1>
            </div>
    } else if (gameInfo.status == STATUS.ERROR) {
        content =
            <div>
                <h1>There was an error returning data to client</h1>
                <p>{gameInfo.message}</p>
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
                <div className='gameInformation'>                <h1 className='gameTitle'>{gameName}</h1>
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
                            <SubmitButton disabled={apiPostLoading === STATUS.SUBMITTING} value={apiPostLoading === STATUS.SUBMITTING ? "Submitting..." : "Submit"} formSubmitFunction={handlePostRequest} cssClasses={"buttonCenter"} />
                            {apiPostLoading === STATUS.ERROR && <p className="submitErrorMessage" >Sorry something went wrong with submitting your rating, please try again or contact system administrator</p>}
                    </>
                )}
                {commentsLoading == STATUS.SUCCESS
                    ? (<div className="commentsGrid" style={{ padding: 20 }}>
                        {comments.rows.map((item) => (
                            <><div class="card border-light mb-3 commentCards">
                                <div class="card-header">01/01/2000</div>
                                <div class="card-body">
                                    <h5 class="card-title">{item.text}</h5>
                                    <p class="card-text">User1</p>
                                </div>
                            </div>
                            </>
                        ))}
                        {commentPage != 1 ? (<button onClick={pageDown} disabled={commentsLoading == STATUS.LOADING}>
                            Previous
                        </button>) : (<div></div>)}
                        <span> Page {commentPage} </span>
                        {comments.nextPage == true ? (<button onClick={pageUp} disabled={commentsLoading == STATUS.LOADING}>
                            Next
                        </button>) : (<div></div>)}
                    </div>)
                    : commentsLoading == STATUS.ERROR
                        ? <p className="commentsLoadingErrorMessage">Sorry something went wrong loading comments, please contact the system administrator</p>
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