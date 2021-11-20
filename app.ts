import express from "express";
import pool from "./src/database/db/db";
import authRouter from "./src/routes/auth.route";
import propertyRouter from "./src/routes/property.route";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 4000;

// connect to DB
pool
  .connect()
  .then(() => console.log("connected to DB"))
  .catch((err: any) => console.log("err", err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/property/", propertyRouter);

// endpoint
app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Congratulations on finding your way around your first endpoint",
  });
});

// listen
app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});

export default app;
