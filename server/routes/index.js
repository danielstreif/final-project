const express = require("express");

const router = express.Router();

const authRouter = require("./auth");
const friendshipsRouter = require("./friendships");
const mapRouter = require("./map");
const userRouter = require("./user");

router.use(authRouter);
router.use(friendshipsRouter);
router.use(mapRouter);
router.use(userRouter);

module.exports = router;
