import express, { Request, Response } from "express";
import ProviderRoutes from "./routes/ProviderRoutes"
import BotRoutes from "./routes/BotRoutes"

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use('/provider',ProviderRoutes)
app.use('/bot',BotRoutes)

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});