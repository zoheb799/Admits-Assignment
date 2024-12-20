import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";
dotenv.config({ path: ".env" });

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});
