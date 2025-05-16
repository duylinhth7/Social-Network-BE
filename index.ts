import express, {Express} from "express";
import indexRouterV1 from "./api/v1/routes/index.route";
import dotenv from "dotenv";
import * as database from "./config/database";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"

dotenv.config();
database.connect();

const app: Express = express();
const port:string | number = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTER CLIENT
indexRouterV1(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})