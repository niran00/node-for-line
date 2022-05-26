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
    "/ufTwLtxJhJZdtzpSvYWASESMtoCwVCUsLVxK53VwTEdwakV4bms8orkp+T+yafQ4oBZHFx6KN316jLQeUIa5bIOQ+pRMfVf5S8SK4FxDTNxmtci12S1fXhn95HLT8GhDizvPs4MGqSkkspSqWwHDgdB04t89/1O/w1cDnyilFU=",
  channelSecret: "f55acfa747d74bae93e4babd97b467a8",
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

let productdata = [];
const handleEvent = async (event) => {
  const { data } = await axios.get(
    `https://afternoon-brook-66471.herokuapp.com/api`
  );
  console.log("data=>>>>", data);
  productdata = data;
  const { synonyms } = productdata;
  let str = [];

  productdata.forEach((result, i) => {
    str.push({
      action: {
        text: productdata.length !== i ? `${result.name}` : result,
        type: "message",
        label: "เลือก",
      },
      imageUrl: productdata.length !== i ? `${result.imagePath}` : result,
    });
  });

  if (!event.type === "message" || !event.text == "Products") {
    return client.replyMessage(event.replyToken, {
      type: "template",
      altText: "this is a image carousel template",
      template: {
        columns: str,
        type: "image_carousel",
      },
    });
  }
};

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
app.use("/api", require("./node-backend/routes/book.routes"));
app.use("/api", require("./node-backend/routes/user.routes"));

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
