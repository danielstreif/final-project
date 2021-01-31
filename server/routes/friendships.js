const express = require("express");
const db = require("../database/friendships");

const router = express.Router();

router.get("/friendships", (req, res) => {
    const userId = req.session.userId;
    db.getFriendships(userId)
        .then(({ rows }) => {
            res.json({ users: rows, idSelf: userId });
        })
        .catch((err) => {
            console.log("Get friendships error: ", err);
            res.json({ error: true });
        });
});

router.get("/friendships-status/:otherId", (req, res) => {
    const { otherId } = req.params;
    const userId = req.session.userId;
    db.getFriendshipStatus(userId, otherId)
        .then((action) => {
            res.json({ success: action });
        })
        .catch((err) => {
            res.json({ error: true });
            console.log("Get friendship status error: ", err);
        });
});

router.post("/friendships-action/:action/:otherId", (req, res) => {
    const { action, otherId } = req.params;
    const userId = req.session.userId;

    if (action == "Add Friend") {
        db.addPendingRequest(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Request error: ", err);
                res.json({ error: true });
            });
    } else if (action == "Accept") {
        db.acceptPendingRequest(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Accept error: ", err);
                res.json({ error: true });
            });
    } else if (
        action == "Cancel" ||
        action == "Decline" ||
        action == "Unfriend"
    ) {
        db.deleteFriendshipStatus(userId, otherId)
            .then((result) => {
                res.json({ success: result });
            })
            .catch((err) => {
                console.log("Delete error: ", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});


module.exports = router;
