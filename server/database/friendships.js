const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

const friendshipStatus = Object.create({
    MAKE_REQUEST: "Add Friend",
    CANCEL_REQUEST: "Cancel",
    ACCEPT_REQUEST: "Accept",
    UNFRIEND: "Unfriend",
});

module.exports.getFriendships = (id) => {
    return db.query(
        `SELECT users.id, first, last, url, accepted, sender_id
        FROM friendships JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

module.exports.getFriendshipStatus = async (senderId, recipientId) => {
    const { rows } = await db.query(
        `SELECT * FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`,
        [senderId, recipientId]
    );

    let action;
    if (rows.length === 0) {
        action = friendshipStatus.MAKE_REQUEST;
    } else if (rows[0].sender_id == senderId) {
        if (rows[0].accepted) {
            action = friendshipStatus.UNFRIEND;
        } else if (!rows[0].accepted) {
            action = friendshipStatus.CANCEL_REQUEST;
        }
    } else if (rows[0].sender_id == recipientId) {
        if (rows[0].accepted) {
            action = friendshipStatus.UNFRIEND;
        } else if (!rows[0].accepted) {
            action = friendshipStatus.ACCEPT_REQUEST;
        }
    }

    return action;
};

module.exports.addPendingRequest = async (sender, recipient) => {
    await db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)`,
        [sender, recipient]
    );

    return friendshipStatus.CANCEL_REQUEST;
};

module.exports.acceptPendingRequest = async (sender, recipient) => {
    await db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (recipient_id = $1 AND sender_id = $2)`,
        [sender, recipient]
    );

    return friendshipStatus.UNFRIEND;
};

module.exports.deleteFriendshipStatus = async (sender, recipient) => {
    await db.query(
        `DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (recipient_id = $1 AND sender_id = $2)`,
        [sender, recipient]
    );

    return friendshipStatus.MAKE_REQUEST;
};
