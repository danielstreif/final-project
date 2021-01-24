const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/network"
);

module.exports.addUser = (firstName, lastName, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
        [firstName, lastName, email, password]
    );
};

module.exports.getCredentials = (email) => {
    return db.query(`SELECT password, id FROM users WHERE email = ($1)`, [
        email,
    ]);
};

module.exports.checkEmailValid = (email) => {
    return db.query(`SELECT id FROM users WHERE email = ($1)`, [email]);
};

module.exports.addResetCode = (email, resetCode) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)`,
        [email, resetCode]
    );
};

module.exports.verifyResetCode = (resetCode, email) => {
    return db.query(
        `SELECT id FROM reset_codes
  WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
  AND code = $1 AND email = $2`,
        [resetCode, email]
    );
};

module.exports.resetPassword = (email, password) => {
    return db.query(
        `UPDATE users
        SET password = $1
        WHERE email = $2`,
        [password, email]
    );
};

module.exports.deleteUser = (userId) => {
    return db.query(
        `DELETE FROM users 
        WHERE id = $1
        RETURNING url`,
        [userId]
    );
};

module.exports.updateCredentials = (userId, first, last, email) => {
    return db.query(
        `UPDATE users
        SET first = $2,
            last = $3,
            email = $4
        WHERE id = $1`,
        [userId, first, last, email]
    );
};

module.exports.updateCredentialsPW = (userId, first, last, email, password) => {
    return db.query(
        `UPDATE users
        SET first = $2,
            last = $3,
            email = $4,
            password = $5
        WHERE id = $1`,
        [userId, first, last, email, password]
    );
};

module.exports.updateProfilePic = (id, url) => {
    return db.query(
        `UPDATE users
        SET url = $1
        WHERE id = $2
        RETURNING (SELECT url FROM users WHERE id = $2)`,
        [url, id]
    );
};

module.exports.deleteProfilePic = (id) => {
    return db.query(
        `UPDATE users
        SET url = NULL
        WHERE id = $1`,
        [id]
    );
};

module.exports.getProfilePic = (id) => {
    return db.query(
        `SELECT url FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.getUserInfo = (id) => {
    return db.query(
        `SELECT id, email, first, last, url, bio FROM users
        WHERE id = $1`,
        [id]
    );
};

module.exports.updateUserBio = (id, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING id`,
        [bio, id]
    );
};

module.exports.getRecentUsers = (id) => {
    return db.query(
        `SELECT id, first, last, url FROM users
        WHERE id != $1
        ORDER BY id DESC LIMIT 3`,
        [id]
    );
};

module.exports.getMatchingUsers = (val, id) => {
    return db.query(
        `SELECT id, first, last, url FROM users
        WHERE first || ' ' || last ILIKE $1 AND id != $2`,
        [val + "%", id]
    );
};
