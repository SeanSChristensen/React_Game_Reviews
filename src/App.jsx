import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

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
    return <h1>{gameName}</h1>;
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
