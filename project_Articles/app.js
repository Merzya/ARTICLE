require("dotenv").config();

const express = require("express");
const app = express();
const read = require('node-readability');

//const articles = [{ title: "Exam" }, { title: "Exam 1" }, { title: "Exam 2" }];
const Article = require("./db").Article;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const port = process.env.PORT || 3001;
app.set("port", process.env.PORT || 3001);

app.get("/", (req, res, next) => {
  res.end(' Message: "start page" ');
});

app.get("/articles", (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err);
    res.format({
      html: () => {
        res.render("articles.ejs", { articles: articles });
      },
      json: () => res.send(articles),
    });
  });
});

app.post("/articles", (req, res, next) => {
  const url = req.body.url;
  read(url, (err, result) => {
    if (err || !result) res.status(500).send("Err downlod");
    Article.create(
      { title: result.title, content: result.content },
      (err, article) => {
        if (err) return next(err);
        res.send("ok");
      }
    );
  });

  const article = { title: req.body.title };
  articles.push(article);
  res.send(article);
});

app.get("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err) => {
    if (err) return next(err);
    res.send(articles);
  });
  // Article.console.log(`fetching:`, id);
  // res.send(articles[id]);
});

app.delete("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err) => {
    if (err) return next(err);
    res.send({ Message: "deleted" });
  });
  // console.log(`deleting:`, id);
  // delete articles[id];
  // res.send({ Message: "deleted" });
});

app.listen(app.get("port"), () => {
  console.log(`web app working at http://127.0.0.1:${app.get("port")}`);
});

module.exports = app;
