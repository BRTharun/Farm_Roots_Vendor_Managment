const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Test route hit");
});

module.exports = router;
