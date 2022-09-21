let express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  mongoDb = require("./database/db");
createError = require("http-errors");
mongoose.Promise = global.Promise;
mongoose
  .connect(mongoDb.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database sucessfully connected ");
    },
    (error) => {
      console.log("Database error: " + error);
    }
  );

const line = require("@line/bot-sdk");
const axios = require("axios").default;

const app = express();

const lineConfig = {
  channelAccessToken:
    "GlIvyT5Kt2S3FqX1MFMu90A+uMPnDuz7fR3nHmZP8f3V4QB/Bh1csJvnYXt7xapPC0e6aFBg+t6SLErNHQK6rYhLlNVUenXSJfjj4V0AggMLjCZsSMrRnF/3IreQpKk1HK/ijLn3+eVuP9Xy0UjwRQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "6dcda73ae3ab0abb0f84cae7f7c0d4c1",
};

const client = new line.Client(lineConfig);

app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

const handleEvent = async (event) => {
  console.log(event)
  client.replyMessage(event.replyToken,{type: 'text' , text:"test" })
}

// let productdata = [];

// const handleEvent = async (event) => {
//   console.log(event);
//   const { data } = await axios.get(
//     `https://line-node-backend.herokuapp.com/api`
//   );
//   console.log("data=>>>>", data);
//   productdata = data;
//   const { synonyms } = productdata;
//   let str = [];

//   productdata.forEach((result, i) => {
//     str.push({
//       action: {
//         text: productdata.length !== i ? `${result.name}` : result,
//         type: "message",
//         label: "เลือก",
//       },
//       imageUrl: productdata.length !== i ? `${result.imagePath}` : result,
//     });
//   });

//   if (event.text === "Products") {
//     return client.replyMessage(event.replyToken, {
//       type: "template",
//       altText: "this is a image carousel template",
//       template: {
//         columns: str,
//         type: "image_carousel",
//       },
//     });
//   }

  
// };

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());

// Static directory path
app.use(
  express.static(path.join(__dirname, "dist/angular-mean-crud-tutorial"))
);

app.all("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header(
      "Access-Control-Allow-Method",
      "GET, PUT, POST, DELETE, OPTIONS, PATCH"
    );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});

// API root
// app.use("/api", require("./node-backend/routes/book.routes"));
// app.use("/api", require("./node-backend/routes/user.routes"));

app.use("/images", express.static(path.join("./node-backend/images")));
// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Base Route
app.get("/", (req, res) => {
  res.send("invaild endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/angular-mean-crud-tutorial/index.html")
  );
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
