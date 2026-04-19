const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());

async function runQuery(queryString) {
    const client = await pool.connect()
    const res = await client.query(queryString)
    client.release()
    return res.rows[0]
}

app.post('/rating', (req, res) => {
    console.log(req.body);
    res.status(201).json({ message: "Data received!"});
});

app.use(cors({
    origin: "http://localhost:5173"
}))

app.get("/", (req, res) => {
    res.send("Node server response")
});

app.listen(PORT, () => {
    console.log('Server running on ',PORT);
})

app.get("/api/hello", (req, res) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString(); 
    console.log("request recieved " + timeString)
    res.json({ message: "Hello from API"})
})

app.get("/api/gameInfo/:gameName", async (req, res) => {
    const gameName = req.params.gameName;
    var result = {};
    try {
        result = await runQuery(`select * from public."Game" where name = '${gameName}'`);
        result["status"] = "Success"
    } catch (e) {
        result = { status: "Fail", error: e}
    }
    res.json(result)
})

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested endpoint does not exist."
    });
});