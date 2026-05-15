import { Button } from 'bootstrap';
import { FaStar } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { SubmitButton } from "../components/submitButton"

export default function ReviewPage() {
    const { gameName } = useParams();

    const [gameInfo, setGameInfo] = useState(null);
    const [gameInfoLoadingStatus, setGameInfoLoadingStatus] = useState("loading");

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [commentPage, setCommentPage] = useState(1);

    const [comments, setComments] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState("loading");

    const [apiPostLoading, setApiPostLoading] = useState("standby");


    const handlePostRequest = async () => {
        try {
            setApiPostLoading("Submitting");
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
            if (result.status == "success") {
                setApiPostLoading("success");
            }
            else {
                setApiPostLoading("fail");
            }
        } catch (error) {
            setApiPostLoading("fail");
        }
    };

    const pageUp = async (e) => {
        e.preventDefault();
        setCommentsLoading("loading")
        setCommentPage(commentPage + 1)
    };

    const pageDown = async (e) => {
        e.preventDefault();
        setCommentsLoading("loading")
        setCommentPage(commentPage - 1)
    };

    useEffect(() => {
        // 1. Start fetching data when the component mounts
        fetch(`http://localhost:3000/api/gameInfo/${gameName}`)
            .then(response => response.json())
            .then(json => {
                setGameInfo(json);
                setGameInfoLoadingStatus("success");
            })
    }, []);

    useEffect(() => {
        if (gameInfoLoadingStatus == "loading") { return }
        else if (gameInfo.status == "Game not found" || gameInfo.status == "error") {
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
                    if (json.status == "error") {
                        setCommentsLoading("error")
                    }
                    else {
                        setCommentsLoading("success")
                    }

                })
        }
    }
        , [commentPage, gameInfoLoadingStatus]);


    let content;

    if (gameInfoLoadingStatus == "loading") content =
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
    } else if (gameInfo.status == "error") {
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

                {apiPostLoading === "success" ? (
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
                            <SubmitButton disabled={apiPostLoading === "Submitting"} value={apiPostLoading === "Submitting" ? "Submitting..." : "Submit"} formSubmitFunction={handlePostRequest} cssClasses={"buttonCenter"} />
                        {apiPostLoading === "fail" && <p className="submitErrorMessage" >Sorry something went wrong with submitting your rating, please try again or contact system administrator</p>}
                    </>
                )}
                {commentsLoading == "success"
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
                        {commentPage != 1 ? (<button onClick={pageDown} disabled={commentsLoading == "loading"}>
                            Previous
                        </button>) : (<div></div>)}
                        <span> Page {commentPage} </span>
                        {comments.nextPage == true ? (<button onClick={pageUp} disabled={commentsLoading == "loading"}>
                            Next
                        </button>) : (<div></div>)}
                    </div>)
                    : commentsLoading == "error"
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