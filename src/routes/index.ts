import { Router } from "express";
import todoRouter from "./todo.routes";

const routes = Router();

// todo route
routes.use('/todo', todoRouter);

export default routes;