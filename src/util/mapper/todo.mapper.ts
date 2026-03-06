import { Todo } from '../../../prisma/generated/prisma/browser';
import { GetTodoResponseDto } from '../../dto/todo.dto';

export class TodoMapper {
  static toGetResponse(raw: Todo[]): GetTodoResponseDto[] {
    return raw.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      status: item.status,
    }));
  }
}