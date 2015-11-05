path = require("path");
fs = require("fs");
module.exports=function(app)
{
    app.get('/',function(req,res){
        res.render('index')
    }); 
    app.post('/package',function(req,res){
        if (res.req.query.message) {
            Bot.tweet(res.req.query.message);
        }
        console.log(res.req.query.message);
        res.sendStatus(res.req.query.message||"no message received");
    });
//    app.get('/downloadTemplate', function(req, res){
//      var file = __dirname + '/../res/template.app';
//      res.download(file); // Set disposition and send it.
//    });
    app.get(/.*\.html.*/, function(req, res) {
        if (req.originalUrl && req.originalUrl.indexOf('.html')!==0) {
            res.render(req.originalUrl.slice(1, req.originalUrl.indexOf('.html')));
        }
        else {
            res.send("Please specify an .html file");
        }
    });
    app.get(/.*\./, function(req, res) {
        var url = req.originalUrl;
        if(url.indexOf('?') !== -1) {
            url = url.slice(0,url.indexOf('?'));
        }
        console.log('GET \'' + url + '\'');
        if (req.originalUrl.indexOf('.css') !== -1) {
            res.setHeader('content-type', 'text/css');
        }
        res.send(fs.readFileSync(path.normalize(__dirname + "/../" + req.originalUrl)));
    });
    app.get(/.*/, function(req, res) {
        if (req.originalUrl === "/downloadTemplate") {
          var file = __dirname + '/../res/template.zip';
          res.download(file, 'template.zip'); // Set disposition and send it.
        }
        else if (req.originalUrl && req.originalUrl.length > 0) {
            res.render(req.originalUrl.slice(1, req.originalUrl.length));
        }
        else {
            res.render(req.originalUrl);
        }
    });
}