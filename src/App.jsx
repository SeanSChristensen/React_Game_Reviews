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

    const [gameInfo, setGameInfo] = useState(null);
    const [gameInfoLoadingStatus, setGameInfoLoadingStatus] = useState("loading");

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);  

    const [commentPage, setCommentPage] = useState(1);

    const [comments, setComments] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState("loading");

    const [apiPostLoading, setApiPostLoading] = useState("standby");
    

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
        setCommentPage(commentPage+1)
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
        else if (gameInfo.status == "Game not found" || gameInfo.status=="error") {
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
                <p>{ gameInfo.message }</p>
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
                        <div className="buttonCenter">                            <form onSubmit={handlePostRequest}>
                            <div>
                                <input
                                    className="btn btn-primary"
                                    type="submit"
                                    value={apiPostLoading === "Submitting" ? "Submitting..." : "Submit"}
                                    disabled={apiPostLoading === "Submitting"} />
                            </div>
                        </form></div>

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

function List() {
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

function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const emailChange = (e) => {
        setEmail(e.target.value)
    };

    const passwordChange = (e) => {
        setPassword(e.target.value)
    };

    const submitButtonPress = () => {
        console.log(email)
        console.log(password)
    };

    return (
        <Layout>
            <div className="registerBox">
                <div className="emailInput">
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control" placeholder="name@example.com" value={email} onChange={emailChange} />
                </div>
                <div class="passwordInput">
                    <div class="col-auto">
                        <label for="inputPassword6" class="col-form-label">Password</label>
                    </div>
                    <div class="col-auto">
                        <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" value={password} onChange={passwordChange} />
                    </div>
                    {password.length > 16
                        ? <div class="col-auto">
                            <span id="passwordHelpInline" class="form-text passwordRequirementText">
                                Cannot be longer than 15 characters
                            </span>
                        </div>
                        : <></>
                    }
                    {password.length < 11
                        ? <div class="col-auto">
                            <span id="passwordHelpInline" class="form-text passwordRequirementText">
                                Must be atleast 10 characters
                            </span>
                        </div>
                        : <></>
                    }
                    <div>
                        <input
                            className="btn btn-primary"
                            type="submit"
                            value="Submit"
                            onClick={submitButtonPress}
                        />
                    </div>

                </div>
            </div>
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
            <Route path="/list" element={<List />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}
