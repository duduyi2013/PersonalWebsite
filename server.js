var express = require('express');
var app = express();
//var bodyParse = require('body-parser');
//var fs = require('fs');
var url = require('url');
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

var path = require('path');

var jade = require('jade');

options = {
	cache: true
}
//var urlencodedParser = bodyParse.urlencoded({entended: false})

app.use(function(req, res, next){
   console.log("Request for " + url.parse(req.url).pathname + " received");
   next();
});
app.use(express.static(path.join(__dirname,'public')));

app.get("/file/resume", function(req, res)  {
	res.download('Resume_JOE.pdf', 'resume_joe.pdf', function(err){
		if (err) {
			console.log(err.stack);
		} else {
			console.log("Finish Downloading");
		}
	}); 
})

app.get("/description",function(req, res){
	options.intro = "YO this is ti";
	console.log(options);
	res.send(jade.renderFile("views/description.jade", {cacahe: true, intro: "Yo this is it!"} ));
});
// app.get("/xmlhttp", function(req, res){
// 	console.log("This is it");
// 	res.send("New XML");
// })
//app.use(bodyParse.urlencoded({ extended: false }));



// app.get('/process_get', function (req, res) {
//    // Prepare output in JSON format
//    response = {
//       first_name:req.query.first_name,
//       last_name:req.query.last_name
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })

// app.post('/process_post', urlencodedParser, function(req, res) {
//    console.log(req.tostring());
//    response = {
//       first_name:req.body.first_name,
//       last_name:req.body.last_name
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })

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


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})