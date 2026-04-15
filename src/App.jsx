import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Layout from "./components/Layout";

function About() {
    return <h1>About Page</h1>;
}

function Home() {
    async function callHelloAPI() {
        fetch('http://localhost:3000/api/hello')
            .then(res => {
                if (!res.ok) {
                    // Log text to see the actual error message/HTML
                    return res.text().then(text => { throw new Error(text) });
                }
                return res.json();
            })
            .then(data => console.log(data))
            .catch(err => console.error('Fetch error:', err));
    }

    return (
        <button onClick={() => callHelloAPI()}>button</button>
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

    if (isLoading) return <div>Loading...</div>;

    if (data.status == "Does Not Exist") {
        return (
            <Layout>
                <div>
                    <h1>Game Does Not Exist</h1>
                </div>
            </Layout>
        )
    }
    else {
        return (
            <Layout>
                <div>
                    <h1>{gameName}</h1>

                    <p><strong>Release Date:</strong> {data?.releaseDate}</p>
                    <p><strong>Publisher:</strong> {data?.publisher}</p>
                    <p><strong>Development Studio:</strong> {data?.developmentStudio}</p>

                    <p><strong>Summary:</strong></p>
                    <p>{data?.summary}</p>

                    <p><strong>Consoles:</strong></p>

                    <ul style={{ listStylePosition: "inside", padding: 0, textAlign: "center" }}>
                        {data?.consoles?.map((c, i) => (
                            <li key={i}>{c}</li>
                        ))}
                    </ul>
                </div>
            </Layout>)
    }
}


export default function App() {
    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Review/:gameName" element={<ReviewPage />} />
        </Routes>
    );
}
