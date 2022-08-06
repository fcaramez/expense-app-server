"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    app.use((req, res, next) => {
        res.status(400).json({ errorMessage: "This route does not exist" });
    });
    app.use((err, req, res, next) => {
        console.error("ERROR", req.method, req.path, err);
        if (!res.headersSent) {
            res.status(500).json({
                errorMessage: "Internal server error. Check the server console",
            });
        }
    });
};