//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res){ //returns all the articles
    Article.find({}, function(err, articles){ //tells user if operation was successful
      if (!err){
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res){ //saves new article into database
    const article = new Article ({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function(err){ //tells user if operation was successful
      if (!err){
        res.send("Successfully added new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res){ //deletes all the articles in the collection
    Article.deleteMany({}, function(err){ //tells user if operation was successful
      if (!err){
        res.send("Successfully deleted all articles");
      } else
      {
        res.send(err);
      }
    });
  })
  .put(function(req, res){

  });

app.route("/articles/:articleTitle") //returns specific article

  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle},  //gets article with certain title
    function(err, foundArticle){
      if (!err){
        if (foundArticle){
          res.send(foundArticle);//tells user if operation was successful
        } else {
          res.send("We have no articles with that name");
        }
      } else {
        res.send("We experienced an error");
      }
    });
  })

  .put(function(req, res){ //updates every part of a specific article
    Article.updateOne(
      {title: req.params.articleTitle}, //looks for article with certain title
      {title: req.body.title, content: req.body.content},
      function(err){ //tells user if operation was successful
        if (!err){
          res.send("Article updated successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

.patch(function(req, res){ //updates a specific part of a specific article
  Article.updateOne(
    {title: req.params.articleTitle}, //looks for article with certain title
    {$set: req.body},
    function(err){ //tells user if operation was successful
      if (!err){
        res.send("Article updated successfully");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){ //deletes a specific article by name
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){ //tells user if operation was successful
      if (!err){
        res.send("Article updated successfully");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() { //server
  console.log("Server started on port 3000");
});
