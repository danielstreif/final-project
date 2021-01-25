const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

module.exports.getAllMarker = () => {
    return db.query(`SELECT * FROM map_marker`);
};

module.exports.getRecentMarker = () => {
    return db.query(`SELECT * FROM map_marker
    ORDER BY id DESC LIMIT 3`);
};

module.exports.getMarkerByUser = (userId) => {
    return db.query(
        `SELECT * FROM map_marker
    WHERE user_id = $1`,
        [userId]
    );
};

module.exports.addMapMarker = (userId, long, lat, title, description) => {
    return db.query(
        `INSERT INTO map_marker (user_id, long, lat, title, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, long, lat, title, description`,
        [userId, long, lat, title, description]
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
