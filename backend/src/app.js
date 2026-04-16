import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
//with extended:true you can give nested objects in url
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//to access and set cookies(perform CRUD operation) on user from server
//attaches cookies to req so you can use req.cookies
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

//Global Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  console.log(err.statusCode, err.message);
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    //err stack is helpful in dev mode because it traces where err came from but in prod mode hide it as it reveals file path , folder/backend structure to users/attackers
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app };
