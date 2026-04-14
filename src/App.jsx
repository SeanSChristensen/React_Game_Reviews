import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function About() {
    return <h1>About Page</h1>;
}

function Home() {
    return <h1>Home</h1>;
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
