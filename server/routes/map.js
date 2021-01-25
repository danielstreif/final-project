const express = require("express");
const db = require("../database/map");

const router = express.Router();

router.get("/map/marker", (req, res) => {
    db.getAllMarker()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("Get map marker error: ", err));
});

router.post("/map/marker", (req, res) => {
    const { userId, long, lat } = req.body;
    db.addMapMarker(userId, long, lat)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => console.log("Add map marker error: ", err));
});

module.exports = router;
