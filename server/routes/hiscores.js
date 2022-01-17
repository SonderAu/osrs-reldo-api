import express from "express";
import hiscores from "osrs-json-hiscores";
var router = express.Router();

/* GET hiscores lookup. */
router.get("/:rsn", function (req, res, next) {
    hiscores
        .getStatsByGamemode(req.params.rsn, req.query.mode || "seasonal")
        .then((response) => res.send(response))
        .catch((err) => {
            console.error(err);
            res.status(err.response.status).send({
                status: err.response.status,
                error: err,
            });
        });
});

export default router;
