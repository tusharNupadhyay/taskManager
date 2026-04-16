import express from "express";

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

export { app };
