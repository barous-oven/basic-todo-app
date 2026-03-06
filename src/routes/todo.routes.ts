import { Router, Request, Response } from "express";
import controller from '../controllers/todo.controllers';

const todoRouter = Router();

todoRouter.get("/", controller.getTodos);

todoRouter.post("/", controller.createTodo);

export default todoRouter;
