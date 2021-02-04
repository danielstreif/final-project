const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

module.exports.getAllMarker = () => {
    return db.query(`SELECT map_marker.id, title, description, long, lat, category, first, last, map_marker.created_at, url AS user_url, user_id FROM map_marker
        JOIN users ON user_id = users.id
    ORDER BY id DESC`);
};

module.exports.getMarkerByUser = (userId) => {
    return db.query(
        `SELECT map_marker.id, title, description, long, lat, category, first, last, map_marker.created_at, url AS user_url, user_id FROM map_marker
        JOIN users ON user_id = users.id
    WHERE user_id = $1
    ORDER BY id DESC`,
        [userId]
    );
};

module.exports.addMapMarker = (
    userId,
    long,
    lat,
    title,
    description,
    category
) => {
    return db.query(
        `INSERT INTO map_marker (user_id, long, lat, title, description, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, long, lat, title, description, category, created_at`,
        [userId, long, lat, title, description, category]
    );
};

module.exports.deleteMapMarker = (markerId) => {
    return db.query(
        `DELETE FROM map_marker 
        WHERE id = $1
        RETURNING id`,
        [markerId]
    );
};

module.exports.deleteMapMarkerByUser = (userId) => {
    return db.query(
        `DELETE FROM map_marker 
        WHERE user_id = $1`,
        [userId]
    );
};

module.exports.addMarkerImages = (markerId, url) => {
    return db.query(
        `INSERT INTO marker_images (marker_id, url)
    VALUES ($1, $2)
    RETURNING url`,
        [markerId, url]
    );
};

module.exports.getMarkerImages = (markerId) => {
    return db.query(
        `SELECT * FROM marker_images
    WHERE marker_id = $1`,
        [markerId]
    );
};

module.exports.deleteMarkerImages = (markerId) => {
    return db.query(
        `DELETE FROM marker_images 
        WHERE marker_id = $1
        RETURNING url`,
        [markerId]
    );
};

module.exports.addComment = (markerId, authorId, comment) => {
    return db.query(
        `WITH inserted AS (INSERT INTO comments (marker_id, author_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *) SELECT inserted.*, users.id AS user, first, last, url FROM inserted
        JOIN users ON inserted.author_id = users.id`,
        [markerId, authorId, comment]
    );
};

module.exports.getComments = (markerId) => {
    return db.query(
        `SELECT comments.id, users.id AS user, first, last, url, comment, comments.created_at FROM comments
        JOIN users ON comments.author_id = users.id
        WHERE marker_id = $1
        ORDER BY comments.id DESC`,
        [markerId]
    );
};

module.exports.deleteComment = (id) => {
    return db.query(
        `DELETE FROM comments 
        WHERE id = $1`,
        [id]
    );
};
