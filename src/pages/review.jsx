import { Button } from 'bootstrap';
import { FaStar } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { SubmitButton } from "../components/submitButton";
import ApiPostFetchHandler from "../services/api/POST";
import ApiGetFetchHandler from "../services/api/GET";
import STATUS from "../services/api/status";

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
        <><h1 className='gameTitle'>{props.gameName}</h1>
                <div className="gameAverageRating">
                {AverageRatingComponent(props.averageRating)}
            </div>
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
        props.apiPostLoading.data && !props.apiPostLoading.loading  ? (
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
                    <SubmitButton disabled={props.apiPostLoading.loading} value={props.apiPostLoading.loading ? "Submitting..." : "Submit"} formSubmitFunction=
                        {props.handlePostRequest}
                cssClasses={"buttonCenter"} />
                    {props.apiPostLoading.error && <p className="submitErrorMessage" >{props.apiPostLoading.error}</p>}
        </>
    )
    }</>

}

function CommentsComponent(props) {
    return <>
        {!props.comments.loading
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

function AverageRatingComponent(averageRatingHook) {
    if (averageRatingHook.loading) {
        return <><div className="text-center gameInfoLoadingSpinner">
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
        </div>;</>
    }
    else {
    return <>
        {[...Array(5)].map((star, index, rating) => {
        index += 1;
            rating = averageRatingHook.data.average_rating;
        return (
            <FaStar
                key={index}
                size={30}
                className={index <= (rating) ? 'on' : 'off'}
                color={index <= (rating) ? '#ffd700' : '#e4e5e9'} />
        );
        })}
    </>
    }


}

export default function ReviewPage() {
    const { gameName } = useParams();

    const [gameInfo, setGameInfo] = useState({ loading: true, data: null, error: null });

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const [commentPage, setCommentPage] = useState(1);
    const [comments, setComments] = useState({ loading: true, data: null, error: null });

    const [averageRating, setAverageRating] = useState({ loading: true, data: null, error: null })

    const [submitRatingStatus, setSubmitRatingStatus] = useState({loading : false, data: null, error: null});

    const handlePostRequest = async () => {
        setSubmitRatingStatus({ loading:true })
        const result = await ApiPostFetchHandler(
            `http://localhost:3000/rating`,
            { rating: rating, game_id: gameInfo.data.game_id },
            {
                'Content-Type': 'application/json',
            })
            setSubmitRatingStatus(result)
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
            const result = await ApiGetFetchHandler(
                `http://localhost:3000/api/gameInfo/${gameName}`,{}
            )
            setGameInfo(result)
        }

        loadGameInfo()
    }, [gameName])

    useEffect(() => {
        async function loadCommentInfo() {
            const result = await ApiGetFetchHandler(
                `http://localhost:3000/api/comments`,
                {
                    'game_id': gameInfo.data.game_id,
                    'page': commentPage
                }
            )
            setComments(result)
        }

        if (gameInfo.data) {
            loadCommentInfo()
        }
    }, [commentPage, gameInfo])

    useEffect(() => {
        async function loadAverageRating() {
            const result = await ApiGetFetchHandler(
                `http://localhost:3000/api/averageRating`,
                {
                    'game_id': gameInfo.data.game_id
                }
            )
            setAverageRating(result)
        }

        if (gameInfo.data) {
            loadAverageRating()
        }
    }, [gameInfo])


    let content;

    content =
        <>
        <div className="gameInfoBox">
            < GameInfoComponent gameName={gameName} gameInfo={gameInfo} averageRating={averageRating} />
            {gameInfo.data
                ? (<>< RatingComponent rating={rating}
                hover={hover}
                setRating={setRating}
                setHover={setHover}
                apiPostLoading={submitRatingStatus}
                STATUS={STATUS}
                handlePostRequest={handlePostRequest} />
            <CommentsComponent
                comments={comments}
                commentPage={commentPage}
                pageUp={pageUp}
                pageDown={pageDown}
            /></>)
                : (<></>)}

        </div>
        </>

    return (
        <Layout>
            {content}
        </Layout>
    )
}