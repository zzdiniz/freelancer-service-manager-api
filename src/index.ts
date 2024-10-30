import express, { Request, Response } from "express";
import ProviderRoutes from "./routes/ProviderRoutes"
import BotRoutes from "./routes/BotRoutes"
import ServiceRoutes from "./routes/ServiceRoutes"
import ClientRoutes from "./routes/ClientRoutes"
import AppointmentRoutes from "./routes/AppointmentRoutes"
import cors from "cors"

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use('/provider',ProviderRoutes)
app.use('/bot',BotRoutes)
app.use('/service', ServiceRoutes)
app.use('/client', ClientRoutes)
app.use('/appointment', AppointmentRoutes)

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});