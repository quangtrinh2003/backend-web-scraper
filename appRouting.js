const router = require("express").Router();
const { getAllNews } = require("./utils.js");

router.get("/:id", getAllNews);

module.exports = router;
