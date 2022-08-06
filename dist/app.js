"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./db");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("./config")(app);
const allRoutes = require("./routes/index.routes");
app.use("/", allRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const expenseRoutes = require("./routes/expense.routes");
app.use("/api", expenseRoutes);
require("./error-handling")(app);
exports.default = app;
