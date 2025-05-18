import express, {Express} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser"
import indexRouterV1 from "./api/v1/routes/client/index.route";

dotenv.config();
database.connect();

const app: Express = express();
const port:string | number = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3000", // URL của frontend (React hoặc client khác)
  credentials: true                // Cho phép gửi cookie
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTER CLIENT
indexRouterV1(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})