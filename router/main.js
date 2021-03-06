var path = require("path");
var fs = require("fs");
var sys = require('sys')
var exec = require('child_process').exec;
module.exports=function(app)
{
    var getURLParam = function( name, url ) {
      if (!url) url = "";
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      return results == null ? null : results[1];
    };
    app.get('/',function(req,res){
        res.render('index')
    }); 
    app.post('/package',function(req,res){
        if (res.req.query.message) {
            // Bot.tweet(res.req.query.message);
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
        res.send(fs.readFileSync(path.normalize(__dirname + "/../" + url)));
    });
    app.get(/.*/, function(req, res) {
        var getURLParam = function( name, url ) {
          if (!url) url = "";
          name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
          var regexS = "[\\?&]"+name+"=([^&#]*)";
          var regex = new RegExp( regexS );
          var results = regex.exec( url );
          return results == null ? null : results[1];
        };
        var url = req.originalUrl;
        var params = '';
        if(url.indexOf('?') !== -1) {
            url = url.slice(0,url.indexOf('?'));
            params = req.originalUrl.slice(req.originalUrl.indexOf('?'), req.originalUrl.length);
        }
        if (url === "/downloadTemplate") {
            var file = __dirname + '/../res/template.zip';
            res.download(file, 'template.zip'); // Set disposition and send it.
        }
        if (url === "/downloadLaunchJava") {
            var addString = getURLParam('addString', params);
            if (addString) {
                var LaunchJava = "#!/bin/sh\n##\n# Launch Script for iWonder Bundler\n# Sat Sep 27, 2014 10:30:00 (Giavaneers - LBM) created\n##\nappMacOSDir=$(cd \"$(dirname \"$0\")\"; pwd)\necho $appMacOSDir\ncd $appMacOSDir\njava -cp ";
                LaunchJava += unescape(addString).trim();
                var LaunchJavaPath = 'res/template.app/Contents/MacOS/LaunchJava';
                fs.writeFileSync(LaunchJavaPath, LaunchJava);
                var puts = function (error, stdout, stderr) { sys.puts(stdout) };
                exec("chmod +x " + LaunchJavaPath, puts);
                exec("zip res/template.zip res/template.app", puts);
                // var file = __dirname + '/../res/template.zip';
                var file = 'res/template.zip';
                res.download(file, 'template.zip'); // Set disposition and send it.
            }
            else {
                res.send("Please pass URL param 'addString'.")
            }
        }
        else if (url && url.length > 0) {
            res.render(req.url.slice(1, req.url.length));
        }
        else {
            res.render(req.url);
        }
    });
}