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

function GameInfoComponent(props) {
    let content;

    if (props.gameInfo.loading) content =

            <div className="text-center gameInfoLoadingSpinner">
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>

        </div>;
    else if (props.gameInfo.error) {
        content =
            <div>
                <p>{props.gameInfo.error}</p>
            </div>
    }
    else {
        const timestamp = props.gameInfo.data.release_date;
        const formattedDate = new Date(timestamp).toLocaleString("en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })

        content =
        <>                <h1 className='gameTitle'>{props.gameName}</h1>
                <div className="gameAverageRating">
                    <h3>Average Rating</h3>
                    {[...Array(5)].map((star, index, rating) => {
                        index += 1;
                        rating = 3;
                        return (
                            <FaStar
                                key={index}
                                size={30}
                                className={index <= (rating) ? 'on' : 'off'}
                                color={index <= (rating) ? '#ffd700' : '#e4e5e9'} />
                        );
                    })}</div>
                <div className='gameInformation'>
                    <p><strong>Release Date:</strong> {formattedDate}</p>
                    <p><strong>Publisher:</strong> {props.gameInfo.data.publisher}</p>
                    <p><strong>Development Studio:</strong> {props.gameInfo.data.development_studio}</p>

                    <p><strong>Summary:</strong></p>
                    <p>{props.gameInfo.data.summary}</p></div></>

    }
    return content
}

function RatingComponent(props) {
    return <>    {
        props.apiPostLoading === STATUS.SUCCESS ? (
            <p className="submittedText" >Submitted!</p>
        ) : (
        <><div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <FaStar
                        key={index}
                        className={index <= (props.hover || props.rating) ? 'on' : 'off'}
                        onClick={() => props.setRating(index)}
                        onMouseEnter={() => props.setHover(index)}
                        onMouseLeave={() => props.setHover(props.rating)}
                        size={30}
                        color={index <= (props.hover || props.rating) ? '#ffd700' : '#e4e5e9'} />
                );
            })}
        </div>
                    <SubmitButton disabled={props.apiPostLoading === STATUS.SUBMITTING} value={props.apiPostLoading === STATUS.SUBMITTING ? "Submitting..." : "Submit"} formSubmitFunction=
                        {props.handlePostRequest}
                cssClasses={"buttonCenter"} />
                    {props.apiPostLoading === STATUS.ERROR && <p className="submitErrorMessage" >Sorry something went wrong with submitting your rating, please try again or contact system administrator</p>}
        </>
    )
    }</>

}

function CommentsComponent(props) {
    return <>        {!props.comments.loading
        ? !props.comments.error
            ? (<div className="commentsGrid" style={{ padding: 20 }}>
                {props.comments.data.rows.map((item) => (
                    <><div class="card border-light mb-3 commentCards">
                        <div class="card-header">01/01/2000</div>
                        <div class="card-body">
                            <h5 class="card-title">{item.text}</h5>
                            <p class="card-text">User1</p>
                        </div>
                    </div>
                    </>
                ))}
                {props.commentPage != 1 ? (<button onClick={props.pageDown} disabled={props.comments == null}>
                    Previous
                </button>) : (<div></div>)}
                <span> Page {props.commentPage} </span>
                {props.comments.data.nextPage == true ? (<button onClick={props.pageUp} disabled={props.comments == null}>
                    Next
                </button>) : (<div></div>)}
            </div>)
            : <p className="commentsLoadingErrorMessage">Sorry something went wrong loading comments, please contact the system administrator</p>
        : <div class="text-center commentLoadingSpinner">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    }</>
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

    content =
        <>
        <div className="gameInfoBox">
            < GameInfoComponent gameName={gameName} gameInfo={gameInfo} />
            < RatingComponent rating={rating}
                hover={hover}
                setRating={setRating}
                setHover={setHover}
                apiPostLoading={apiPostLoading}
                STATUS={STATUS}
                handlePostRequest={handlePostRequest} />
            <CommentsComponent
                comments={comments}
                commentPage={commentPage}
                pageUp={pageUp}
                pageDown={pageDown}
            />
        </div>
        </>

    return (
        <Layout>
            {content}
        </Layout>
    )
}