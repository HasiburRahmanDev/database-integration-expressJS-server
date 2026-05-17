import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
const app: Application = express();
const port = config.port;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express server",
    author: "Next level",
  });
});
// Post users in the database

app.use("/api/users", userRoute);

app.use("/api/profile", profileRoute);

export default app;
