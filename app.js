const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

/* For GraphQL Playground*/
const graphqlHTTP = require("express-graphql");
const graphqlSchema = require("./gql-schema");

/* Database Connection */
mongoose.connect(
  "mongodb+srv://arwinsurewin:arwinsurewin001@cluster0-3rvif.mongodb.net/capstone3?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Now Connected to MongoDB atlas Server");
});

// const PORT = process.env.PORT || 4000;

// const mongooseOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

/* Middlewares */
app.use(cors());

/* GQL Playground */
app.use("/graphql", graphqlHTTP({ schema: graphqlSchema, graphiql: true }));

/* File Upload */
app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  file.mv(`../frontend/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

/* Server Initialization */
app.listen(4000, () => {
  console.log("Now Serving on port 4000");
});

// mongoose.connect(
//   "mongodb+srv://arwinsurewin:arwinsurewin001@cluster0-3rvif.mongodb.net/capstone3?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );

// mongoose.connection.once("open", () => {
//   console.log("Now Connected to MongoDB atlas Server");
// });

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3rvif.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
//     mongooseOptions
//   )
//   .then(() => {
//     app.listen(PORT, () => {
//       console.info(`MongoDB Connected!`);
//       console.log(`CORS-enabled web server listening on port ${PORT}`);
//       console.info(`Listening to PORT: ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
