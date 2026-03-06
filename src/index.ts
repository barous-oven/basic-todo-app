import express, { Request, Response } from "express"
import routes from "./routes"
import dotenv from "dotenv";

dotenv.config();
const app = express()

app.use(express.json());

const prefix = process.env.PREFIX_API || "/api/v1";
app.use(prefix, routes);

app.get("/health", (req: Request, res: Response) => {
  res.send("Healthy")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})