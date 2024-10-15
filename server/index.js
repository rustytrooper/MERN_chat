require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const app = express();


app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  })

const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(`server on port ${PORT} falled`)
  }
})