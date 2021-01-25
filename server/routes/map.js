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

router.post("/map/marker/new", (req, res) => {
    const { userId, long, lat } = req.params;
    db.addMapMarker(userId, long, lat)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("Add map marker error: ", err));
});

module.exports = router;
