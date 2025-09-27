const express = require("express");
const routerTictac = require("./routes/tictac");
const app = express();
app.use(express.json());

app.use("/api/tictac", routerTictac);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});