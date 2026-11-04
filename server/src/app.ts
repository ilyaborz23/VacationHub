import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes";
import authRoutes from "./routes/authRoutes";
import mcpRoutes from "./routes/mcpRoutes";
import vacationRoutes from "./routes/vacationRoutes";
import { IMAGES_DIR } from "./utils/images";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(IMAGES_DIR));

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/vacations", vacationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
