const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

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
    console.log("request recieved")
    res.json({ message: "Hello from API"})
})