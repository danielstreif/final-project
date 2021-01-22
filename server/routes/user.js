const express = require("express");
const s3 = require("../s3");
const { s3Url } = require("../config.json");
const db = require("../db/users");
const { hash } = require("../bc");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const router = express.Router();

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${__dirname}/uploads`);
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

router.get("/user/search", (req, res) => {
    const val = req.query.q;
    if (val !== "undefined" && val.length !== 0) {
        db.getMatchingUsers(val, req.session.userId)
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Get matching users error: ", err);
                return res.json({ error: true });
            });
    } else {
        db.getRecentUsers(req.session.userId)
            .then(({ rows }) => {
                return res.json(rows);
            })
            .catch((err) => {
                console.log("Get recent users error: ", err);
                return res.json({ error: true });
            });
    }
});

router.get("/user/profile", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => console.log("GetUserInfo error: ", err));
});

router.post("/user/profile/edit", (req, res) => {
    const userId = req.session.userId;
    const { first, last, email, password, deleteAcc } = req.body;
    if (deleteAcc) {
        db.getWallPost(userId)
            .then(async ({ rows }) => {
                for (let i in rows) {
                    const filename = rows[i].url.replace(s3Url, "");
                    await s3.delete(filename);
                }
            })
            .then(() => {
                db.deleteUser(userId).then(async ({ rows }) => {
                    const filename = rows[0].url.replace(s3Url, "");
                    await s3.delete(filename);
                    req.session = null;
                    res.json({ success: true });
                });
            })
            .catch((err) => {
                console.log("Account deletion error: ", err);
                res.json({ error: true });
            });
    } else if (password) {
        hash(password).then((hash) => {
            db.updateCredentialsPW(userId, first, last, email, hash)
                .then(() => res.json({ success: true }))
                .catch((err) => {
                    console.log("Account setting error: ", err);
                    res.json({ error: true });
                });
        });
    } else {
        db.updateCredentials(userId, first, last, email)
            .then(() => res.json({ success: true }))
            .catch((err) => {
                console.log("Account setting error: ", err);
                res.json({ error: true });
            });
    }
});

router.get("/user/profile/:id", (req, res) => {
    const { id } = req.params;
    if (id == req.session.userId) {
        return res.json({ invalid: true });
    }
    if (id == "null") {
        return res.json({ invalid: true });
    }
    db.getUserInfo(id)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ invalid: true });
            } else {
                return res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("Get user info error: ", err);
            res.json({ error: true });
        });
});

router.post("/user/bio/edit", (req, res) => {
    db.updateUserBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ error: true });
            } else {
                return res.json({ success: true });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
});

router.post(
    "/user/image/upload",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        if (req.file) {
            const url = `${s3Url}${req.file.filename}`;
            db.updateProfilePic(req.session.userId, url)
                .then(({ rows }) => {
                    if (rows[0].url) {
                        const filename = rows[0].url.replace(s3Url, "");
                        s3.delete(filename);
                    }
                    res.json({ url: url });
                })
                .catch((err) => {
                    console.log("Upload error: ", err);
                    res.json({ error: true });
                });
        } else {
            res.json({ error: true });
        }
    }
);

router.get("/user/image/delete", (req, res) => {
    const id = req.session.userId;
    db.getProfilePic(id)
        .then(({ rows }) => {
            const url = rows[0].url;
            if (url) {
                return url;
            } else {
                throw new Error("No image in database");
            }
        })
        .then((url) => {
            db.deleteProfilePic(id).then(() => {
                const filename = url.replace(s3Url, "");
                s3.delete(filename);
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

module.exports = router;
