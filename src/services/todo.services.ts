import { GetTodoResponseDto } from "../dto/todo.dto";
import { Todo } from "../models/todo.model";
import todoRepository from "../repositories/todo.repositories";
import { TodoMapper } from "../util/mapper/todo.mapper";

class TodoService {
  private repo = todoRepository;

  async getTodos(): Promise<GetTodoResponseDto[]> {
    const data = await this.repo.getTodos();

    return TodoMapper.toGetResponse(data);
  }

  public async createTodo(todo: Todo) {}
}

export default new TodoService();
