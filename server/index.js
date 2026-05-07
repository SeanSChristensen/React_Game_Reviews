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

var client = pool.connect()

async function runQuery(queryString) {
    const res = await pool.query(queryString)
    return res
}

app.post('/rating', async (req, res) => {
    var result = {};
    try {
        result = await runQuery(`INSERT INTO public.review(rating,game_id) VALUES (${req.body.rating}, '${req.body.game_id}')`)
        if (result.rowCount == 1) {
            res.status(201).json({ status: "success" });
        }
        else {
            res.status(500).json({ status: "fail" });
        }
    }
    catch (e) {
        result = { status: "Error", error: e }
        res.status(500).json({ status: "fail" });
    }
});

app.use(cors({
    origin: "http://localhost:5173"
}))

app.listen(PORT, () => {
    console.log('Server running on ', PORT);
})

app.get("/api/gameInfo/:gameName", async (req, res) => {
    const gameName = req.params.gameName;
    var result = {};
    var response = {}
    try {
        result = await runQuery(`select * from public."Game" where name = '${gameName}'`)
        if (result.rowCount == 0) {
            console.log("not found")
            res.json({ status: "Game not found" })
        }
        else {
            response.status = "Success"
            response.data = result.rows[0]
            res.json(response)
        }
    } catch (e) {
        result = { status: "error", message: "database error please contact system administrators", error: e }
        res.json(result)
    }
})

app.get("/api/averageRating", async (req, res) => {
    const game_id = req.params.game_id;
    var result = {};
    try {
        result = await runQuery(`select AVG(rating) from public."review" where name = '${game_id}'`);
        result.rows[0]["status"] = "Success"
    } catch (e) {
        result = { status: "Fail", error: e }
    }
    res.json(result.rows[0])
})

app.get("/api/comments", async (req, res) => {
    var result = {};
    var result2;
    try {
        result = await runQuery(`select * from public.comment where game_id = '${req.headers.game_id}' offset ${(req.headers.page * 5) - 5} limit 5`);
        result2 = await runQuery(`select count(game_id) from public.comment where game_id = '${req.headers.game_id}'`);
        result["status"] = "Success"
        if (req.headers.page * 5 >= result2.rows[0].count) {
            result["nextPage"] = false
        }
        else {
            result["nextPage"] = true
        }
    } catch (e) {
        result = { status: "fail", error: e }
    }
    res.json(result)
})

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested endpoint does not exist."
    });
});