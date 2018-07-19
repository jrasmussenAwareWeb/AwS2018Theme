var fs = require('fs');

fs.rename('gulpfilebabel.js', 'gulpfile.babel.js', function(err) {
    if (err) console.log('ERROR: ' + err);
});