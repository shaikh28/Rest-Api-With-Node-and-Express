const express = require("express");
const { logReqRes } = require("./middleware/index");
const userRouter = require("./routes/user");
const app = express();
const { connectMongoDB } = require("./connection");
const port = 3000;

// Connection
connectMongoDB("mongodb://localhost:27017/BDW").then(()=>console.log("MongoDB Connected"))

app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

// Routes
app.use("/api/users", userRouter);
app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
