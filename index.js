const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const { auth } = require("./middlewares/authmiddleware");
const { userRouter } = require("./routes/user.routes");
const { postsRouter } = require("./routes/posts.routes");

const app=express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017');
const db=mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use("/users",userRouter);
app.use("posts",auth,postsRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

