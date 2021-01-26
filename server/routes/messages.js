const express = require("express");
const db = require("../database/messages");

const router = express.Router();

router.get("/user/messages/:id", (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    db.getPrivateChat(userId, id)
        .then(({ rows }) => {
            for (let i in rows) {
                rows[i].time = rows[i].created_at.toLocaleString();
            }
            const result = {
                success: rows.sort((a, b) => {
                    return a.id - b.id;
                }),
            };
            res.json(result);
        })
        .catch((err) => {
            console.log("Get private chat error: ", err);
            res.json({ error: true });
        });
});

router.post("/user/message", (req, res) => {
    const userId = req.session.userId;
    const { otherId, message } = req.body;
    db.addPrivateMessage(userId, otherId, message)
        .then(({ rows }) => {
            db.getNewPrivateMessage(rows[0].id)
                .then(({ rows }) => {
                    const newMessage = rows[0];
                    newMessage.time = newMessage.created_at.toLocaleString();
                    res.json({ success: newMessage });
                })
                .catch((err) => console.log("Get new message error: ", err));
        })
        .catch((err) => {
            console.log("Send private message error: ", err);
            res.json({ error: true });
        });
});

module.exports = router;
