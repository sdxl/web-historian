var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpR = require('http-request')
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, "utf-8", function(err, file){
    if (err) {
      throw error;
    } else {
      var filestr = file.toString('ascii', 0, file.length);
      output = filestr.split('\n');
      callback(output)
    }
  })
};
//turns file into an array by line breaks
//executes callback on that array

exports.isUrlInList = function(target, func){
  var bool = false;
  exports.readListOfUrls(function(urls){
    for (var i = 0; i < urls.length; i++){
      if (urls[i] === target) {bool = true}
    }
  func(bool)
  })
};
//
//

exports.addUrlToList = function(target, callback){
  //use fs.appendFile() to add url to exports.paths.list file;
  // console.log(typeof callback)
  func = callback || function(){} //wtf?

  fs.appendFile(exports.paths.list, (target + "\n"), function(err){
    if (err) throw err;
    console.log("URL was appended")
  })

  func()
  // callback() // why????

};

exports.isUrlArchived = function(file, callback){
  fs.open((exports.paths.archivedSites + "/" + file), "r", function(err, fd){
    if (err) {
      // throw err
      console.log("checked, it's not archived.")
      callback(false);
    } else {
      console.log("this is archived: " + (exports.paths.archivedSites + "/" + file))
      callback(true);
    }
  })
};

exports.downloadUrls = function(arr){
    arr.forEach(function(entry){
      //make sure that the blank last newline is not causing issues...
      exports.isUrlArchived(entry, function(bool){
        if (bool) { console.log("we've already got it!") }
        else {
          //http-request comes into play here.
          httpR.get(('http://' + entry), function(err, res){
            if (err){
              console.log('error!')
            } else {
              fs.writeFile ( exports.paths.archivedSites + "/" + entry, res.buffer.toString(), function(err, stuff) {
                if (err) {
                  console.log('we"ve got an error!')
                } else {
                  console.log("it worked! in theory...")
                }
              })
            }
          })
        }
      })
    })
      //site already in site folder?
      //do nothing
    //download and add to sites folder
};
