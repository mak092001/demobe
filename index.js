let express = require("express");
let app = express();
require("dotenv").config();
let mango = require("mongoose");
let bp = require("body-parser");
let getschema = require("./schema.js");
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
mango
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("error Found while connecting to Database - " + err);
  });
app.get("/", (req, res) => {
  getschema
    .find()
    .then((op) => {
      res.json(op);
      console.log("Data found at Homepage and  rendered");
    })
    .catch((err) => {
      console.log("error found at Fetching data homepage - " + err);
    });
});
app.post("/", (req, res) => {
  let schema = new getschema({
    name: req.body.saveasname,
    email: req.body.saveasemail,
    mobile: req.body.saveasmobile,
    city: req.body.saveascity,
  });
  schema
    .save()
    .then(() => {
      console.log("Data send");
    })
    .catch((err) => {
      console.log("error found at sending data" + err);
    });
});
app.get("/:id", (req, res) => {
  getschema
    .findById(req.params.id)
    .then((op) => {
      if (op) {
        res.send(op);
      } else {
        res.status(400).send("not found");
      }
    })
    .catch((err) => {
      res.send(err);
      console.log("couldnt get one" + err);
    });
});
app.get("/create", (req, res) => {
  res.render("create");
  console.log("Redirected to Create Page");
});
app.get("/edit/:id", (req, res) => {
  getschema.findById(req.params.id).then((op) => {
    if (op) {
      // res.render("edit", { data: op });
      res.json(op);
      console.log("sended for edit");
    } else {
      console.log("couldnt send for edit");
    }
  });
});
app.put("/edit", (req, res) => {
  getschema.findByIdAndUpdate(
    req.body.saveashidden,
    {
      name: req.body.saveasname,
      email: req.body.saveasemail,
      mobile: req.body.saveasmobile,
      city: req.body.saveascity,
    },
    (err, response) => {
      if (err) {
        console.log("error at Updating data - " + err);
      } else {
        console.log("Data updated and rendered");
      }
    }
  );
});
app.delete("/delete/:id", (req, res) => {
  getschema
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      console.log("Data deleted");
    })
    .catch((err) => {
      console.log("couldnt delete - " + err);
    });
});
let port = process.env.PORT;
app.listen(port, () => {
  console.log("listening at-" + port);
});
