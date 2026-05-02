import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Layout from "./components/Layout";
import { Button } from 'bootstrap';
import { FaStar } from 'react-icons/fa';



function About() {
    return (
        <Layout>
            <h1>This is the about page</h1>
            <h2>Welcome</h2>
        </Layout>
    )
}

function Home() {
    return (
        <Layout>
            <h1>This is the home page</h1>
            <h2>Welcome</h2>
        </Layout>
    )
}

function Search() {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    return (
        <Layout>
            <div class="input-group mb-3 w-50 position-absolute top-50 start-50 translate-middle">
                <input type="text" class="form-control" placeholder="Game Name" aria-label="Recipient's username" aria-describedby="basic-addon2" value={input}
                    onChange={(e) => setInput(e.target.value)} />
                    <div class="input-group-append">
                    <button class="btn btn-outline-secondary" id="customSearchButton" type="button" onClick={() => { navigate("/Review/" + input); }}>Search</button>
                    </div>
            </div>
        </Layout>
    )
}

function ReviewPage() {
    const { gameName } = useParams();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);  

    const [commentPage, setCommentPage] = useState(1);

    const [comments, setComments] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const [apiPostLoading, setApiPostLoading] = useState("waiting");

    const currentitems = ["test", "test", "test"]

    

    const handlePostRequest = async (e) => {
        e.preventDefault();
        try {
            setApiPostLoading("loading");
            const response = await fetch(`http://localhost:3000/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: rating,
                    game_id: data?.game_id
                }),
            });
            const result = await response.json();
            console.log(result);
            if (result.status == "success") {
                setApiPostLoading("success");
            }
            else {
                setApiPostLoading("fail");
            }
        } catch (error) {
            console.log(error);
            setApiPostLoading("fail");
        } 
    };

    const pageUp = async (e) => {
        e.preventDefault();
        setCommentPage(commentPage+1)
    };

    const pageDown = async (e) => {
        e.preventDefault();
        setCommentPage(commentPage - 1)
    };

    useEffect(() => {
        // 1. Start fetching data when the component mounts
        fetch(`http://localhost:3000/api/gameInfo/${gameName}`)
            .then(response => response.json())
            .then(json => {
                setData(json);
                setIsLoading(false);
            })
    }, []); 

    useEffect(() => {
        fetch(`http://localhost:3000/api/comments`, {
            method: 'GET',
            headers: {
                //temporary change this to dynamic game id later
                'game_id': 'bbaa500a-bc96-4964-bc0b-3b9f5db00552',
                'page': commentPage 
            }
        })
            .then(response => response.json())
            .then(json => {
                setComments(json)
                setCommentsLoading(false)
            })
    }, []); 


    let content;

    if (isLoading || commentsLoading) content = <div>Loading...</div>;
    else if (data.status == "Game not found") {
        content =
            <div>
                <h1>Game not found</h1>
            </div>
    } else if (data.status == "error") {
        console.log(data.error)
        content =
            <div>
                <h1>There was an error returning data to client</h1>
                <p>{ data.message }</p>
            </div>
    }
    else {
        const timestamp = data?.release_date;
        const formattedDate = new Date(timestamp).toLocaleString("en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })

        content =
            <div className="gameInfoBox">
                <h1>{gameName}</h1>
                <p><strong>Release Date:</strong> {formattedDate}</p>
                <p><strong>Publisher:</strong> {data?.publisher}</p>
                <p><strong>Development Studio:</strong> {data?.development_studio}</p>

                <p><strong>Summary:</strong></p>
                <p>{data?.summary}</p>
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
                            <form onSubmit={handlePostRequest}>
                                <div className="buttonCenter">
                                    <input
                                        className="btn btn-primary"
                                        type="submit"
                                        value={apiPostLoading === "loading" ? "Submitting..." : "Submit"}
                                        disabled={apiPostLoading === "loading"} />
                                </div>
                            </form>
                            {apiPostLoading === "fail" && <p className="submitErrorMessage" >Sorry something went wrong with submitting your rating, please try again or contact system administrator</p>}
                        </>
                )}
                <div>
                    <ul>
                        {comments.rows.map((item, index) => (
                            <li key={index}>{item.text}</li>
                        ))}
                    </ul>
                    <button onClick={pageDown}>
                        Previous
                    </button>
                    <span> Page {commentPage} of 1 </span>
                    <button onClick={pageUp}>
                        Next
                    </button>
                </div>
            </div>

    }

    return (
        <Layout>
            {content}
        </Layout>
    )
}


export default function App() {
    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<Home />} />
            <Route path="/Review/:gameName" element={<ReviewPage />} />
        </Routes>
    );
}
