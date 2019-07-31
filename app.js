const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");



const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.";
const contactContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";


const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({etxtended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
//var posts=[];
app.get("/",function(req,res){
  //console.log(posts);
  Post.find({}, function(err,posts){
    res.render("home",{startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.post("/compose",function(req, res){
  //console.log(req.body.postTitle);
  const post=new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postName",function(req,res){

  const requestedTitle = _.lowerCase(req.params.postName);
  Post.find({},function(err,posts){
    posts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);
      if(storedTitle === requestedTitle){
        res.render("post",{
          title: post.title,
          content: post.content
        });
      }
    });
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});











app.listen(3000, function(){
  console.log("Server started on port 3000");
})
