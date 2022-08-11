require("dotenv/config");
require("./db");
import express, { Application } from "express";

const app: Application = express();
require("./config")(app);

const allRoutes: any = require("./routes/index.routes");
app.use("/", allRoutes);

const authRoutes: any = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const expenseRoutes: any = require("./routes/expense.routes");
app.use("/api", expenseRoutes);

const socialRoutes: any = require("./routes/social.routes");
app.use("/api", socialRoutes);

require("./error-handling")(app);

export default app;
