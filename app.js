//PACKAGES
var bodyParser        = require("body-parser"),
methodOverride        = require("method-override"),
expressSanitizer      = require("express-sanitizer"),
mongoose              = require("mongoose"),
express 	          = require("express"),
app 	              = express(),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose");
// DB
mongoose.connect("mongodb://localhost:27017/restful_blog_app", 
	{useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,});
// EXPRESS SESSION CONFIG
app.use(require("express-session")({
	secret: "rusty",
	resave: false,
	saveUninitialized: false
}))
// PASSPORT CONFIG
app.use(passport.initilize())
app.use(passport.session())
// ENCODING DATA
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// EJS VIEW-ENGINE
app.set("view engine", "ejs");
app.use(express.static("public"));
// BODY PARSER REQUIRED FOR ANY FORM
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now},
});
var Blog = mongoose.model("Blog", blogSchema);


// RESTFUL ROUTES
// ==============
// Home Page
// ==============
app.get("/", function(req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		} else{
			res.render("index", {blogs: blogs})
		}
	});
});
// ==============
// NEW ROUTE
// ==============
app.get("/blogs/new", function(req, res){
	res.render("new");
});
// ==============
// CREATE ROUTE
// ==============
app.post("/blogs", function(req, res){
	//create blog post
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			//redirects to blog screen with new post
			res.redirect("/blogs");
		}
	});
});
//=============================
// TODAY AUTHENTICATION
//=============================
// register users
app.get("/blogs/register", function(req, res){
	res.render("login");
});
app.post("/blogs/register", function(req, res){
	// res.redirect("/blogs");
	let newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.redirect("/register");
		} else {
			res.redirect("/blogs");
		}
	});
	// How is this logic working?
	// passport.authenticate("local")(req, res function(){
	// 	res.redirect("/blogs");
	// })
});
// user login
app.get("/blogs/login", function(req, res){
	res.render("register");
});
app.post("/blogs/login", passport.authenticate("local", {
	successRedirect: "/blogs",
	failureRedirect: "/login"
}) function(req, res){});
//=============================
// TODAY End
//=============================
// ==============
// SHOW ROUTE
// ==============
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
});
// ==============
// EDIT ROUTE
// ==============
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	})
});
// ==============
// UPDATE ROUTE
// ==============
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
});
// ==============
// DELETE ROUTE
// ==============
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	})
})
app.listen(3000, function(){
	console.log("SERVER IS RUNNING!");
})