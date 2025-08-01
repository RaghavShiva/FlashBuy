const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000


app.use(express.json({ limit: '10mb' }))
const allowedOrigins = [
    process.env.BASE_URL
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})
