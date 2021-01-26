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
            const result = rows.sort((a, b) => {
                return a.id - b.id;
            });

            res.json({ success: result, otherId: id });
        })
        .catch((err) => {
            console.log("Get private chat error: ", err);
            res.json({ error: true });
        });
});

module.exports = router;
