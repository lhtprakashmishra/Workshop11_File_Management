import express, { json } from "express";
import fileRoutes from "./routes/route.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/files", fileRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
