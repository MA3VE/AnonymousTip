const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { Info } = require("./models/info");
const { Page } = require("./models/page");
const fs = require("fs");

const password = fs.readFileSync(".password").toString().trim();

const app = express();
mongoose
    .connect(
        `mongodb+srv://emkay:${password}@cluster0-lbp6f.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.post("/info", (req, res) => {
    const info = new Info(req.body);
    info.save((err, data) => {
        if (err) return res.json(err);
        console.log(data);
    });
    return res.status(200);
});

app.post("/page", (req, res) => {
    const page = new Page(req.body);
    page.save((err, data) => {
        if (err) return res.json(err);
        // console.log(data);
    });
    return res.status(200);
});

app.get("/info/:address", (req, res) => {
    const address = req.params.address;
    Info.findOne({ address }, (err, data) => {
        if (err) return res.json(err);
        res.send(data);
    });
    return res.status(200);
});

app.get("/page/:address", (req, res) => {
    const address = req.params.address;
    Page.findOne({ address }, (err, data) => {
        if (err) return res.json(err);
        res.send(data);
    });
    return res.status(200);
});

app.patch("/info/:address/incLike", (req, res) => {
    const address = req.params.address;
    Info.findOneAndUpdate({ address }, { $inc: { likes: 1 } }, (err, data) => {
        if (err) return res.json(err);
        console.log(data);
    });
    return res.status(200);
});

app.patch("/info/:address/decLike", (req, res) => {
    const address = req.params.address;
    Info.findOneAndUpdate({ address }, { $inc: { likes: -1 } }, (err, data) => {
        if (err) return res.json(err);
        console.log(data);
    });
    return res.status(200);
});

app.listen(5000, () => {
    console.log("port is running on port 5000");
});