import { useState } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>Counters that update together</h1>
            <MyButton count={count} onClick={handleClick} />
            <MyButton count={count} onClick={handleClick} />
            
        </div>
    )


    function MyButton({ count, onClick }) {
        return (
            <button onClick={onClick}>
                Clicked {count} times
            </button>
        );
    }
}

export default App
