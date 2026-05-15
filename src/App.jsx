import { Routes, Route } from 'react-router-dom';
import Home from "./pages/home"
import ReviewPage from "./pages/review"
import Search from "./pages/search"
import About from "./pages/about"
import List from "./pages/list"
import Register from "./pages/register"

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
