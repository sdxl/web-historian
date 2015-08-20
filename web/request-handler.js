var path = require('path');
var fs = require('fs');
var arch = require('../helpers/archive-helpers');
var urlToCheck;
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET' && req.url.length === 1){
    var headers = defaultCorsHeaders;
    // console.log(Object.keys(req))
    fs.readFile('./public/index.html', function(err, html){
      if(err){
        headers["Content-Type"] = "text/plain";
        res.writeHead(404, headers);
        res.end('Cannot find index');
      }else{
        headers["Content-Type"] = "text/html";
        res.writeHead(200, headers);
        res.end(html);
      }
    })
  }

  else if(req.method === 'POST'){
    var headers = defaultCorsHeaders;
    console.log("received a post request")
    var contentString = "";
    req.on("data", function(chunk){
      contentString += chunk;
    })
    req.on("end", function(){
      urlToCheck = contentString.slice(4);
      //if first are http, remove.
      //if first are not www, add.
      headers["Content-Type"] = "text/plain";
      res.writeHead(200, headers);
      // res.end("we're sorry, we don't have: " + urlToCheck)

      //this block checks if it's in the list, adds it if not in the list.
      arch.isUrlInList(urlToCheck, function(bool){
        if (bool) {console.log("it's already in the list")}
        else {
          console.log("it's not in the list! let's add it!")
          arch.addUrlToList(urlToCheck) //I think we can get away without a function....
        }
      })

      //this block separately runs to see if the page is archived yet.
      arch.isUrlArchived(urlToCheck, function(bool){
        if (bool) {
          console.log("it is archived... or should be: ", (arch.paths.archivedSites + "/" + urlToCheck))
          fs.readFile((arch.paths.archivedSites + "/" + urlToCheck), function(err, html){
            if(err){
              headers["Content-Type"] = "text/plain";
              res.writeHead(404, headers);
              res.end("isUrlArchived said it existed, but I couldn't find it.");
            }else{
              console.log("we're trying to serve up the archived page")
              headers["Content-Type"] = "text/html";
              res.writeHead(200, headers);
              res.end(html); //return archive index
            }
          })
        }
        else {
          fs.readFile('./public/loading.html', function(err, html){
            if(err){
              headers["Content-Type"] = "text/plain";
              res.writeHead(404, headers);
              res.end('Cannot find loading page');
            }else{
              console.log("we're trying to serve up the loading page")
              headers["Content-Type"] = "text/html";
              res.writeHead(200, headers);
              res.end(html);
            }
          })
        }
      }) //end isUrlArchived, and its anonymous function.

    }) //end req.on data
  } //end POST

  else if(req.method === 'OPTIONS'){
    console.log('you need an option!!!!');
  }

  else if (req.method === 'GET') {
    //needs to handle archive page calls... to do later perhaps
    if (req.url === "/favicon.ico") {
      console.log("favicon!")
      res.end("")
    } else {
    console.log(req.url);
    console.log("we got a get request that is not for index or favicon");
    var headers = defaultCorsHeaders;
    //readListOfUrls(isUrlArchived)
    //downloadUrls
    }

  }

  else {
    console.log("failed, sending 404")
    headers["Content-Type"] = "text/plain";
    res.writeHead(404, headers);
    res.end("asked for something I'm not setup to handle");
  }
};
  // res.end(archive.paths.list);

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": "10" //Seconds.
};
