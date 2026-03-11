# Basic Todo App

A simple and intuitive todo application to help you manage your daily tasks efficiently.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/barous-oven/basic-todo-app.git
   ```
2. Navigate to the project directory:
   ```
   cd basic-todo-app
   ```
3. Install dependencies (if any):

   ```
   yarn install
   ```

4. Prisma setup

- make sure you have a `.env` with your `DATABASE_URL`.
- run migrations and generate the client:
  ```
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- if you update the schema later, re‑run the above commands or use `npx prisma db push` as required.

## Usage

1. Run the application:
   ```
   yarn start
   ```
2. Open your browser and go to `http://localhost:3000` (or the specified port).
3. Start adding and managing your todos!

## Technologies Used

- Nestjs 11.0.1
