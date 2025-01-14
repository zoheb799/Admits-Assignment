import express from "express";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/route.js";

export const app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: "true", limit: "50mb"}));
app.use(cookieParser());

app.use('/api/v1',UserRouter);

