import express from "express";
import logger from "morgan";
import userRouter from "./routes/userRoute";

const app = express();

app.use(express.json());
app.use(logger("dev"));

app.use("/", userRouter);

const PORT = 4005;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
});