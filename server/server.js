const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const path = require("path");
const routes = require("./routes");
const db = require("./database/messages");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SESSION_SECRET,
    maxAge: process.env.MAX_AGE,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(
    express.urlencoded({
        extended: true,
    }),
    express.json()
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(routes);

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

if (require.main === module) {
    server.listen(process.env.PORT || 3001, function () {
        console.log("Server up.");
    });
}

let socketIds = {};
let onlineUsersMultiple = [];
let onlineUsersSingle = [];

io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    socketIds[socket.id] = userId;
    onlineUsersMultiple.push(userId);
    onlineUsersSingle = [...new Set(onlineUsersMultiple)];

    const updateOnlineUsers = () => {
        db.getOnlineUsers(onlineUsersSingle)
            .then(({ rows }) => {
                io.sockets.emit("users online", rows);
            })
            .catch((err) => console.log("Get online users error: ", err));
    };

    updateOnlineUsers();

    socket.on("disconnect", () => {
        delete socketIds[socket.id];
        const index = onlineUsersMultiple.indexOf(userId);
        if (index >= 0) {
            onlineUsersMultiple.splice(index, 1);
            onlineUsersSingle = [...new Set(onlineUsersMultiple)];
            return updateOnlineUsers();
        }
    });

    socket.on("friend request", (otherId) => {
        for (const key in socketIds) {
            if (socketIds[key] == otherId) {
                db.getBasicUserInfo(otherId)
                    .then(({ rows }) => {
                        io.sockets.sockets
                            .get(key)
                            .emit("friend request received", {
                                fromUser: rows[0],
                            });
                    })
                    .catch((err) =>
                        console.log("Receive friend request error: ", err)
                    );
            }
        }
    });

    socket.on("new message outgoing", ({ msg, otherId }) => {
        db.addPrivateMessage(userId, otherId, msg)
            .then(({ rows }) => {
                db.getNewPrivateMessage(rows[0].id)
                    .then(({ rows }) => {
                        const newMessage = rows[0];
                        newMessage.time = newMessage.created_at.toLocaleString();
                        for (const key in socketIds) {
                            if (socketIds[key] == otherId) {
                                io.sockets.sockets
                                    .get(key)
                                    .emit("new message received", {
                                        fromUser: userId,
                                        msg: newMessage,
                                    });
                            }
                        }
                        socket.emit("display sent message", newMessage);
                    })
                    .catch((err) =>
                        console.log("Get new message error: ", err)
                    );
            })
            .catch((err) => {
                console.log("Send private message error: ", err);
            });
    });

    socket.on("delete message", (messageId) => {
        db.deletePrivateMessage(messageId)
            .then(() => {
                socket.emit("message deleted", messageId);
            })
            .catch((err) => console.log("Message deletion error: ", err));
    });
});
