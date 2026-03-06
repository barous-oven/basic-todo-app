type TodoStatus = 'DONE' | 'PENDING' | "IN_PROGRESS"

export interface Todo {
  title: string,
  status: TodoStatus,
  description: string
}