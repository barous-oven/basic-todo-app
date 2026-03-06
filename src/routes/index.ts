import { Router } from "express";
import todoRouter from "./todo.routes";

const routes = Router();

// todo route
routes.use('/todos', todoRouter);

export default routes;