import { Todo } from "../models/todo.model";
import {prisma} from "../config/database";

const todos: Todo[] = [
  { title: "Learn Express", description: "Learn Express", status: "DONE" },
  {
    title: "Learn TypeScript",
    description: "Learn Express",
    status: "PENDING",
  },
];

class TodoRepository {
  public async getTodos() {
    return prisma.todo.findMany();
  }
}

export default new TodoRepository();