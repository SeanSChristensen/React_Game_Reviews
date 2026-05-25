const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');
const jose = require("jose");


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

const KeycloakJsonWebKeySet = getKeycloakJsonWebKeySet();

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());

var client = pool.connect()

async function runQuery(queryString) {
    const res = await pool.query(queryString)
    return res
}

function getKeycloakJsonWebKeySet() {
    const result = jose.createRemoteJWKSet(new URL('http://localhost:8080/realms/my-react-app/protocol/openid-connect/certs'))
    return result
}


async function isTokenValid(token) {
    try {
        await jose.jwtVerify(token, KeycloakJsonWebKeySet, { issuer: 'http://localhost:8080/realms/my-react-app' })
        return true
    }
    catch {
        return false
    }
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
    if (await isTokenValid(req.headers.token) == false) {
        res.status(401).json({
            status: "error", message: "unauthorised"
        });
    }
    else {
        try {
            result = await runQuery(`select * from public."Game" where name = '${gameName}'`)
            if (result.rowCount == 0) {
                res.status(404).json({ status: "Game not found" });
            }
            else {
                response.status = "Success"
                response.data = result.rows[0]
                res.status(200).json(response)
            }
        } catch (e) {
            result = { status: "error", message: "database error please contact system administrators", error: e }
            res.status(500).json(result)
        }
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
        res.status(200)
        if (req.headers.page * 5 >= result2.rows[0].count) {
            result["nextPage"] = false
        }
        else {
            result["nextPage"] = true
        }
    } catch (e) {
        result = { status: "error", error: e }
            res.status(500).json({ status: "error", error: e })
        }
    }
    res.json(result)
})


app.get("/api/gameList/", async (req, res) => {
    var result = {};
    var response = {};
    try {
        result = await runQuery(`select name from public."Game"`);
        response.status = "Success"
        response.data = result.rows
        res.status(200)
    } catch (e) {
        response = { status: "error", error: e }
        res.status(500)
    }
    res.json(response)
})

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested endpoint does not exist."
    });
});

//Sleep function for testing (await sleep(Xms))
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}