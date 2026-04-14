import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function About() {
    return <h1>About Page</h1>;
}

function Home() {
    return <h1>Home</h1>;
}


export default function App() {
    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}
