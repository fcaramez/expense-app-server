import { Application, NextFunction, Request, Response } from "express";

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({ errorMessage: "This route does not exist" });
  });

  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error("ERROR", req.method, req.path, err);
    if (!res.headersSent) {
      res.status(500).json({
        errorMessage: "Internal server error. Check the server console",
      });
    }
  });
};
