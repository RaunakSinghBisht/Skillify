import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";

// Connect to the DB first; only start accepting requests once it succeeds
await connectDB();

app.listen(config.PORT, () => {
  console.log(`Server is Running on Port ${config.PORT}`);
});
