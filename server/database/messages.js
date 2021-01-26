const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

module.exports.getOnlineUsers = (userArr) => {
    return db.query(
        `SELECT id, first, last, url FROM users WHERE id = ANY($1)`,
        [userArr]
    );
};

module.exports.getBasicUserInfo = (id) => {
    return db.query(
        `SELECT id, first, last, url FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.getRecentChat = () => {
    return db.query(
        `SELECT users.id AS user, first, last, url, message, chat_messages.created_at, chat_messages.id
        FROM chat_messages
        LEFT JOIN users ON chat_messages.user_id = users.id
        ORDER BY id DESC LIMIT 10`
    );
};

module.exports.addChatMessage = (id, msg) => {
    return db.query(
        `INSERT INTO chat_messages (user_id, message)
        VALUES ($1, $2)
        RETURNING id`,
        [id, msg]
    );
};

module.exports.getNewMessage = (id) => {
    return db.query(
        `SELECT chat_messages.created_at, chat_messages.id, message, users.id AS user, first, last, url 
        FROM chat_messages
        LEFT JOIN users ON chat_messages.user_id = users.id
        WHERE chat_messages.id = $1`,
        [id]
    );
};

module.exports.getPrivateChat = (ownId, otherId) => {
    return db.query(
        `SELECT users.id AS user, first, last, url, message, private_messages.created_at, private_messages.id FROM private_messages
        LEFT JOIN users ON private_messages.sender_id = users.id
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        ORDER BY private_messages.id DESC LIMIT 50`,
        [ownId, otherId]
    );
};

module.exports.addPrivateMessage = (sender, recipient, msg) => {
    return db.query(
        `INSERT INTO private_messages (sender_id, recipient_id, message)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [sender, recipient, msg]
    );
};

module.exports.getNewPrivateMessage = (messageId) => {
    return db.query(
        `SELECT users.id AS user, first, last, url, message, private_messages.created_at, private_messages.id FROM private_messages
        LEFT JOIN users ON private_messages.sender_id = users.id
        WHERE private_messages.id = $1`,
        [messageId]
    );
};
