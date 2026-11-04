import "dotenv/config";
import express from "express";
import cors from "cors";
import vacationRoutes from "./routes/vacationRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/vacations", vacationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
