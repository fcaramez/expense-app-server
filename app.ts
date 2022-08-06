require("dotenv/config");
require("./db");
import express, { Application, Router } from "express";

const app: Application = express();
require("./config")(app);

const allRoutes: any = require("./routes/index.routes");
app.use("/", allRoutes);

const authRoutes: any = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const expenseRoutes: any = require("./routes/expense.routes");
app.use("/api", expenseRoutes);

require("./error-handling")(app);

export default app;
