const express = require("express");
const db = require("../database/map");
const s3 = require("../s3");
const { s3Url } = require("../config.json");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const router = express.Router();

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${__dirname}/../uploads`);
    },
    filename: (req, file, callback) => {
        uidSafe(24)
            .then((uid) => {
                callback(null, `${uid}${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback(err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

router.get("/map/marker", async (req, res) => {
    const { rows } = await db.getAllMarker();
    for (let i in rows) {
        rows[i].time = rows[i].created_at.toLocaleString();
    }
    const data = rows;
    for (let i in data) {
        const { rows } = await db.getMarkerImages(data[i].id);
        if (rows.length > 0) {
            data[i].url = rows[0].url;
        }
    }
    res.json(data);
});

router.get("/map/marker/:id", async (req, res) => {
    const { id } = req.params;
    const { rows } = await db.getMarkerByUser(id);
    for (let i in rows) {
        rows[i].time = rows[i].created_at.toLocaleString();
    }
    const data = rows;
    for (let i in data) {
        const { rows } = await db.getMarkerImages(data[i].id);
        if (rows.length > 0) {
            data[i].url = rows[0].url;
        }
    }
    res.json(data);
});

router.post(
    "/map/marker",
    uploader.single("image"),
    s3.upload,
    async (req, res) => {
        const { userId, long, lat, title, description, category } = req.body;
        const { rows } = await db.addMapMarker(
            userId,
            long,
            lat,
            title,
            description,
            category
        );
        rows[0].time = rows[0].created_at.toLocaleString();
        const data = rows[0];
        let newUrl;
        if (req.file) {
            const url = `${s3Url}${req.file.filename}`;
            const { rows } = await db.addMarkerImages(data.id, url);
            newUrl = rows[0].url;
            data.url = newUrl;
        }
        res.json(data);
    }
);

router.get("/map/marker/remove/:id", (req, res) => {
    const { id } = req.params;
    db.deleteMapMarker(id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => console.log("Get remove marker error: ", err));
});

router.get("/map/comments/:id", (req, res) => {
    const { id } = req.params;
    db.getComments(id)
        .then(({ rows }) => {
            for (let i in rows) {
                rows[i].time = rows[i].created_at.toLocaleString();
            }
            res.json(rows);
        })
        .catch((err) => console.log("Get comments error: ", err));
});

router.get("/map/comments/delete/:id", (req, res) => {
    const { id } = req.params;
    db.deleteComment(id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("Get comments error: ", err));
});

router.post("/map/comment", (req, res) => {
    const { markerId, userId, comment } = req.body;
    db.addComment(markerId, userId, comment)
        .then(({ rows }) => {
            rows[0].time = rows[0].created_at.toLocaleString();
            res.json({ success: rows[0] });
        })
        .catch((err) => console.log("Add comment error: ", err));
});

module.exports = router;
