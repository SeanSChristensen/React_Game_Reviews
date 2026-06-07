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


async function getEmailFromToken(token) {
    const details = jose.decodeJwt(token)
    return details.email
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
    if (await isTokenValid(req.headers.token) == false) {
        res.status(401).json({
            error: "unauthorised"
        });
    }
    else {
        const email = await getEmailFromToken(req.headers.token)
        var result = {};
        var result2 = {};
        try {
            result = await runQuery(`INSERT INTO public.review(rating,game_id) VALUES (${req.body.rating}, '${req.body.game_id}')`)
            result2 = await runQuery(`INSERT INTO public.comment(text,game_id) VALUES ('${req.body.userComment}', '${req.body.game_id}')`)
            if (result.rowCount == 1 && result2.rowCount == 1) {
                res.status(201).json({ data: "success" });
            }
            else {
                res.status(500).json({ error: "fail" });
            }
        }
        catch (e) {
            res.status(500).json({ error: "Database error, please contact system administrator or try again" });
        }
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
            error: "unauthorised"
        });
    }
    else {
        try {
            result = await runQuery(`select * from public."Game" where name = '${gameName}'`)
            if (result.rowCount == 0) {
                res.status(404).json({ error: "Game not found" });
            }
            else {
                response.data = result.rows[0]
                res.status(200).json(response)
            }
        } catch (e) {
            result = { error: "database error please contact system administrators" }
            res.status(500).json(result)
        }
    }

})

app.get("/api/averageRating", async (req, res) => {
    if (await isTokenValid(req.headers.token) == false) {
        res.status(401).json({
            error: "unauthorised"
        });
    }
    else {
    const game_id = req.headers.game_id;
    var result = {};
    try {
        result = await runQuery(`SELECT COALESCE(ROUND(AVG(rating)), 0) FROM public."review" WHERE game_id = '${game_id}'`);
    } catch (e) {
        result = { error:"database error"}
    }
    res.json({ data: { average_rating: result.rows[0].coalesce } } )
    }
})

app.get("/api/comments", async (req, res) => {
    if (await isTokenValid(req.headers.token) == false) {
        res.status(401).json({
            error: "unauthorised"
        });
    }
    else {
    var result = {};
    var result2;
        try {
            result = await runQuery(`select * from public.comment where game_id = '${req.headers.game_id}' offset ${(req.headers.page * 5) - 5} limit 5`);
            result2 = await runQuery(`select count(game_id) from public.comment where game_id = '${req.headers.game_id}'`);
            res.status(200)
            if (req.headers.page * 5 >= result2.rows[0].count) {
                result["nextPage"] = false
            }
            else {
                result["nextPage"] = true
            }
            res.json({ data: result })
        } catch (e) {
            res.status(500).json({ error: "internal server error" })
        }
    }
    }   
)


app.get("/api/gameList/", async (req, res) => {
    var result = {};
    var response = {};
    try {
        result = await runQuery(`select name from public."Game"`);
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