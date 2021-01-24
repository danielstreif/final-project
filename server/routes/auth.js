const express = require("express");
const db = require("../database/users");
const { hash, compare } = require("../bc");
const cryptoRandomString = require("crypto-random-string");
const ses = require("../ses");

const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    let userId;
    db.getCredentials(email)
        .then(({ rows }) => {
            userId = rows[0].id;
            return compare(password, rows[0].password);
        })
        .then((result) => {
            if (result) {
                req.session.userId = userId;
                res.json({ success: true });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("Login error: ", err);
            res.json({ error: true });
        });
});

router.get("/logout", (req, res) => {
    req.session = null;
    res.json({ logout: true });
});

router.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hash) => {
            return db.addUser(first, last, email, hash);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Registration error: ", err);
            res.json({ error: true });
        });
});

router.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    const secretCode = cryptoRandomString({ length: 6 });
    db.checkEmailValid(email)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ error: true });
            }
            return db.addResetCode(email, secretCode).then(() => {
                return ses
                    .sendEmail(email, secretCode, "Reset Password")
                    .then(() => {
                        res.json({ success: true });
                    });
            });
        })
        .catch((err) => {
            console.log("Reset error: ", err);
            res.json({ error: true });
        });
});

router.post("/password/reset/verify", (req, res) => {
    const { code, email, password } = req.body;
    db.verifyResetCode(code, email)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return res.json({ error: true });
            }
            hash(password)
                .then((hash) => {
                    db.resetPassword(email, hash);
                })
                .then(() => {
                    res.json({ success: true });
                });
        })
        .catch((err) => {
            console.log("Verification error: ", err);
            res.json({ error: true });
        });
});

module.exports = router;
