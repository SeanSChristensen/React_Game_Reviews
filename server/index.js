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
    const now = new Date();
    const timeString = now.toLocaleTimeString(); 
    console.log("request recieved " + timeString)
    res.json({ message: "Hello from API"})
})

app.get("/api/gameInfo/FarCry3", (req, res) => {
    res.json(
        {
            "gameName": "Far Cry 3",
            "releaseDate": "2012-11-29",
            "summary": "Far Cry 3 is an open-world first-person shooter set on a tropical island where players take on the role of Jason Brody, a tourist stranded among pirates and mercenaries. The game combines exploration, combat, crafting, and stealth as players fight to survive and rescue their friends.",
            "publisher": "Ubisoft",
            "developmentStudio": "Ubisoft Montreal",
            "consoles": [
                "PlayStation 3",
                "Xbox 360",
                "Microsoft Windows"
            ]
        }
    )
})