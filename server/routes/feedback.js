import express from "express";
import {
    submitBug,
    submitSuggestion,
    submitFeedback,
} from "../service/feedbackService";
var router = express.Router();

router.post("/", function (req, res) {
    submitFeedback(req.body).then((response) =>
        res.status(response.status).send(response)
    );
});

router.post("/bug", function (req, res) {
    submitBug(req.body).then((response) =>
        res.status(response.status).send(response)
    );
});

router.post("/suggestion", function (req, res) {
    submitSuggestion(req.body).then((response) =>
        res.status(response.status).send(response)
    );
});

export default router;
