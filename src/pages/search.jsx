import Layout from "../components/Layout";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function Search() {
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