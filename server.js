var express = require('express');
var app = express();
//var bodyParse = require('body-parser');
//var fs = require('fs');
var url = require('url');

var path = require('path');

var jade = require('jade');
options = {
	cache: true
}

var mysql = require("mysql");

//local database
var pool = mysql.createPool({
	connectionLimit : 10,
	host: "localhost",
	user: "root",
	password: "Wgq1992521!",
	database: "joeweb"
});

//server database
// var pool = mysql.createPool({
// 	connectionLimit : 10,
// 	host: "localhost",
// 	user: "joesbaby",
// 	password: "Wgq1992521!!",
// 	database: "joesbaby_joeweb"
// });

// ------------------mangodb database---------------------------
// var MongoClient = require('mongodb').MongoClient;
// var dbURL = 'mongodb://localhost:27017/joeweb';
// var findProject = function(db, callback) {
// 	var requiredProj = db.collection('project').find();
// 	requiredProj.toArray(function(err, doc){
// 		if (doc != null) {
// 			callback(doc);
// 		}
// 	})
// }

//var urlencodedParser = bodyParse.urlencoded({entended: false})

app.use(function(req, res, next){
   console.log("Request for " + url.parse(req.url).pathname + " received");
   next();
});
app.use(express.static(path.join(__dirname,'public')));

app.get("/file/:filetype/:project?", function(req, res)  {
	console.log("Here");
	var file = "";
	if (req.params.filetype == "resume") {
		file = 'private/Resume_JOE.pdf';
	} else if (req.params.filetype == "article") {
		if (req.params.project == "music"){
			file = 'private/musicSyncSummary.pdf';
		}
	} else if (req.params.filetype == "code") {
		if (req.params.project == "music"){
			file = 'private/src.zip';
			console.log("unitchan!");
		}
	} else if (req.params.filetype == "exe") {
		if (req.params.project == "unitychan"){
			file = 'private/UnityChan.app.zip';
		}
	}
	res.download(file, file, function(err){
		if (err) {
			console.log(err.stack);
			res.send(err.stack);
		} else {
			console.log("Finish Downloading");
		}
	}); 
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})

app.get("/description-:prjName", function(req, res){
	pool.getConnection(function(err, connection){
		if (err) {
			res.json({
				"code" : 100,
				"status" : "Error in connection database"
			});
			return ;
		}
		var query = "select * from projects where name='" + req.params.prjName + "'"; 
		connection.query(query, function(err, rows){
			connection.release();
			var eachOptions = Object.create(options);
			if (!err) {
				// console.log("------------------Rows------------------------");
				// console.log("the solution is: ", rows);
				// console.log("type: ", typeof(rows));
				// console.log("json: ", JSON.stringify(rows));
				if (rows.length > 0) {
					eachOptions.intro = rows[0].description;
					if (rows[0].videoSrc) {
						eachOptions.videoEnable = true;
						eachOptions.videoSrc = rows[0].videoSrc;
					}

					if (rows[0].articleURL) {
						eachOptions.PaperEnable = true;
						eachOptions.articleURL = rows[0].articleURL;
					}

					if (rows[0].codeURL) {
						eachOptions.CodeEnable = true;
						eachOptions.codeURL = rows[0].codeURL;
					}

					if (rows[0].exeURL) {
						eachOptions.ExeEnbale = true;
						eachOptions.exeURL = rows[0].exeURL;
					}

					if (rows[0].website) {
						eachOptions.WebsiteEnbale = true;
						eachOptions.website = rows[0].website;
					}
					console.log("Intro: " + eachOptions.intro);
					res.send(jade.renderFile("views/description.jade", eachOptions));	
				} else {
					console.log("no data gtt from database");
					res.send("Cannot reach the file");
				}
			} else {
				console.log("error for query");
			}
		});
	});

})

// ------------------mangodb database---------------------------
// app.get("/description",function(req, res){
// 	var intro = "";
// 	MongoClient.connect(dbURL, function(err, db) {
// 		findProject(db, function(doc) {
// 			for (var i = 0; i < doc.length; i++) {
// 				//console.log(JSON.stringify(doc[i]));
// 				intro = doc[i].description;	
// 			}
// 			options.intro = intro;
// 			console.log("options: " + options);

// 			res.send(jade.renderFile("views/description.jade", options));
// 		})	
// 	})
// });


// 
// ------------------AJAX---------------------------
// app.get("/xmlhttp", function(req, res){
// 	console.log("This is it");
// 	res.send("New XML");
// })
//app.use(bodyParse.urlencoded({ extended: false }));



// ------------------get---------------------------
// app.get('/process_get', function (req, res) {
//    // Prepare output in JSON format
//    response = {
//       first_name:req.query.first_name,
//       last_name:req.query.last_name
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })


// ------------------post---------------------------
// app.post('/process_post', urlencodedParser, function(req, res) {
//    console.log(req.tostring());
//    response = {
//       first_name:req.body.first_name,
//       last_name:req.body.last_name
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })


// ------------------file upload---------------------------
// var multer = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'tmp/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname + '-' + Date.now())
//   }
// })
// var uploadFile = multer({storage : storage});
//
// app.post('/file_upload', uploadFile.single('picture'), function (req, res) {
//    console.log(req.file.name);
//    console.log(req.file.path);
//    var file = __dirname + "/" + req.file.name;
   
//    fs.readFile( req.file.path, function (err, data) {
//       fs.writeFile(file, data, function (err) {
//          if( err ){
//             console.log( err );
//             }else{
//                response = {
//                   message:'File uploaded successfully',
//                   filename:req.file.name
//                };
//             }
//          console.log( response );
//          res.end( JSON.stringify( response ) );
//       });
//    });
// })