import express, {Express} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser"
import indexRouterV1 from "./api/v1/routes/client/index.route";
import { Server } from "socket.io";
import http from "http";
import chatSocket from "./sockets/chat.socket";
import postSocket from "./sockets/post.socket";

dotenv.config();
database.connect();

const app: Express = express();
const port:string | number = process.env.PORT || 3000;


//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // hoặc chỉ định frontend URL
  },
});
// Khởi tạo socket handler
chatSocket(io);
postSocket(io)



app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTER CLIENT
indexRouterV1(app);


server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})