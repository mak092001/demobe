let express = require("express");
let app = express();
let mango = require("mongoose");
let bp = require("body-parser");
require("dotenv").config();
let getschema = require("./public/js/schema.js");
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
mango
  .connect(process.env.murl, {
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
      res.render("homepage", { data: op });
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
      res.redirect("/");
    })
    .catch(() => {
      console.log("error found at sending data");
      res.redirect("/create");
    });
});
app.get("/create", (req, res) => {
  res.render("create");
  console.log("Redirected to Create Page");
});
app.get("/edit/:id", (req, res) => {
  getschema.findById(req.params.id).then((op) => {
    if (op) {
      res.render("edit", { data: op });
      console.log("sended for edit");
    } else {
      console.log("couldnt send for edit");
    }
  });
});
app.post("/edit", (req, res) => {
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
        res.redirect("/");
      }
    }
  );
});
app.get("/delete/:id", (req, res) => {
  getschema
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      res.redirect("/");
      console.log("Data deleted");
    })
    .catch((err) => {
      console.log("couldnt delete - " + err);
      res.redirect("/");
    });
});
let port = 5035;
app.listen(port, () => {
  console.log("listening at-" + port);
});
