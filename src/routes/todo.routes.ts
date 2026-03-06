import { Router, Request, Response } from "express";

const todoRouter = Router();

todoRouter.get("/", (req: Request, res: Response) => {
  res.json([
    { id: 1, title: "Learn Express", completed: false },
    { id: 2, title: "Learn TypeScript", completed: true },
  ]);
});

todoRouter.post("/", (req: Request, res: Response) => {
  const { title } = req.body;

  res.json({
    message: "Todo created",
    title,
  });
});

export default todoRouter;
