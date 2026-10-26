import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import { errHandler, notFound } from "./middleware/errorMiddleware.js";
import { userRouter } from "./routes/userRoutes.js";
import { categoryRouter } from "./routes/categoryRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import bannerRouter from "./routes/bannersRoutes.js";
import contactRouter from "./routes/contactRouter.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowAllOrigins = configuredOrigins.includes("*");
const extraOrigins = configuredOrigins.filter((origin) => origin !== "*");

const developmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

const allowedOrigins = extraOrigins.length
  ? extraOrigins
  : process.env.NODE_ENV === "production"
    ? []
    : developmentOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error(`Origin ${origin} is not allowed by CORS`);
      error.statusCode = 403;
      return callback(error);
    },
  })
);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/api/status", (req, res) => {
  res.send({ message: "Backend is up and running!" });
});

app.use("/api", uploadRoutes);
app.use("/api/users", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api", cartRouter);
app.use("/api", reviewRouter);
app.use("/api/banners", bannerRouter);
app.use("/", contactRouter);

app.use(notFound);
app.use(errHandler);

export default app;
