import { Todo } from "../../prisma/generated/prisma/browser";

export interface CreateTodoRequestDto {
  title: string;
  description: string;
}

export type GetTodoResponseDto = Omit<Todo, "createdAt" | "updatedAt">;
