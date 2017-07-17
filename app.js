var express = require("express");
var app = express();
var path = require("path");
var superagent=require("superagent");
var cheerio = require("cheerio");
var url = require("url");
var qs = require("querystring");

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/",function(req,res,next){
		console.log("https://cnodejs.org/?tab=all&page="+req.query.page);
		// https://cnodejs.org/?tab=all&page=3
	 superagent.get("https://cnodejs.org/?tab=all&page="+req.query.page).end(function(err,data){
	 	$ = cheerio.load(data.text);
	 	var arr = [];
	 	var queryUrl = $("#content .pagination ul li:last-child a").attr("href");
	 	if(queryUrl == undefined)
	 	{
	 		queryUrl="?tab=all&page=520";
	 	}
	 	queryUrl = url.parse(queryUrl).query;
	 	obj = qs.parse(queryUrl);
	 	$("#topic_list .cell").each(function(index,ele){
	 		arr.push({
	 			img_href:$(ele).find("img").attr("src"),
	 			type:$(ele).find(".topic_title_wrapper").children("span").text(),
	 			content_href:$(ele).find(".topic_title_wrapper").children("a.topic_title").attr("href"),
	 			content:$(ele).find(".topic_title_wrapper").children("a.topic_title").text()
	 		});
	 	});
	 	arr.push({totalPage:obj.page});
	  console.log(arr.length);
	 
	 res.send(arr);
	 });
});
app.get("/list",function(req,res,next){
	res.render("index");
});
app.listen(3000);