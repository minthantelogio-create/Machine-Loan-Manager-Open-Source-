const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(bodyParser.json());
app.use(express.static("public"));

db.run(`
CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    serial TEXT,
    status TEXT
)
`);

app.get("/machines", (req, res) => {
    db.all("SELECT * FROM machines", (err, rows) => {
        res.json(rows);
    });
});

app.post("/machines", (req, res) => {
    const { name, serial } = req.body;

    db.run(
        "INSERT INTO machines (name, serial, status) VALUES (?, ?, 'available')",
        [name, serial],
        () => res.json({ message: "Machine added" })
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
