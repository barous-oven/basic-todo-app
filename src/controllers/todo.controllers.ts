import { Request, Response } from "express";
import { GetTodoResponseDto } from "../dto/todo.dto";
import todoService from "../services/todo.services";
import BaseResponse from "../util/response/base.response";

class TodoController {
  private service = todoService;

  public getTodos = async (req: Request, res: Response) => {
    const data = await this.service.getTodos();

    BaseResponse.success<GetTodoResponseDto[]>(res, data);
  };

  public createTodo = async (req: Request, res: Response): Promise<void> => {
    const data = await this.service.createTodo(req.body);

    BaseResponse.success(res, data);
  };

  // public updateTodo = async (req: Request, res: Response): Promise<void> => {
  //   const data = await this.service.updateTodo(req.params.id, req.body);

  //   BaseResponse.success(res, data);
  // };

  // public deleteTodo = async (req: Request, res: Response): Promise<void> => {
  //   const data = await this.service.deleteTodo(req.params.id);

  //   BaseResponse.success(res, data);
  // };
}

export default new TodoController();
