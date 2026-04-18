import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Layout from "./components/Layout";
import { Button } from 'bootstrap';

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

    useEffect(() => {
        // 1. Start fetching data when the component mounts
        fetch(`http://localhost:3000/api/gameInfo/${gameName}`)
            .then(response => response.json())
            .then(json => {
                setData(json);
                setIsLoading(false); // 2. Stop loading when data arrives
            })
    }, []); // [] ensures this effect runs ONLY once on load

    let content;

    if (isLoading) content = <div>Loading...</div>;
    else if (data.status == "Fail") {
        content =
            <div>
                <h1>Error</h1>
            </div>
    }
    else {
        content =
            <div>
                <h1>{gameName}</h1>
                <p><strong>Release Date:</strong> {data?.release_date}</p>
                <p><strong>Publisher:</strong> {data?.publisher}</p>
                <p><strong>Development Studio:</strong> {data?.development_studio}</p>

                <p><strong>Summary:</strong></p>
                <p>{data?.summary}</p>
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
            <Route path="/home" element={<Home />} />
            <Route path="/Review/:gameName" element={<ReviewPage />} />
        </Routes>
    );
}
