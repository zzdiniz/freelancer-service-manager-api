import express, { Request, Response } from "express";
import ProviderRoutes from "./routes/ProviderRoutes"

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use('/provider',ProviderRoutes)

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});