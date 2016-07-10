var express = require('express')
var path = require('path')
var compression = require('compression')

var app = express()

app.use(compression())

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'public')))

// If running in prod, auto-redirect to https.
// Thanks to http://jaketrent.com/post/https-redirect-node-heroku/
if (app.get('env') == 'production') {
    console.log("Enabling trust proxy");
    app.enable('trust proxy');
}

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
    console.log("Request protocol = " + req.protocol);
    if (app.get('env') == 'production' && req.protocol != 'https') {
        res.redirect("https://" + req.hostname + req.originalUrl);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

var PORT = process.env.PORT || 8080
app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT)
})