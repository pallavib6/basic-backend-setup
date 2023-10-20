//IMPORT ROUTES
const authRoute = require("./routes/auth/auth");
const loginRoute = require("./routes/login/login");
const authDashBoard = require("./routes/auth/authDashBoard");
const express = require("express");

const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4050;

app.get("/", (req, res) => {
    res.send(`Hey it's working Yai Yai !!`);
});

app.listen(PORT, () => console.log(`Server up and running at ${PORT}`));


const mongoose = require("mongoose");
const cors = require("cors");

//CONNECTION TO DATABASE
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
)

//MIDDLEWARE -> DISABLING CORS AND USER FOR JSON OUTPUT
app.use(express.json(), cors());

//ROTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/users", loginRoute);
app.use("/api/dashboard", authDashBoard);