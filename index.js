var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var agent = 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/webhook', function (req, res) {

    try {
        let speech = '';

        if (req.body) {
          var requestBody = req.body;

          if (requestBody.result) {

            if (requestBody.result.action === 'tech.cms.evaluate') {

              const contexts = requestBody.result.contexts; 
              let cmsContext = {};
              let speech = '';
              
              // Locate and store the current CMS context, containing all of the user's parameters 
              for (let context of contexts) {
                if (context.name === "tech-cms") {
                  cmsContext = context;
                }
              }

              // cms object created as a basis of evaluation.
              const cms = {
                stack: cmsContext.parameters['tech-stack'],
                brochure: cmsContext.parameters.brochure === 'yes' ? true : false,
                commerce: cmsContext.parameters.ecommerce === 'yes' ? true : false,
                features: cmsContext.parameters.features || []
              };

              console.log(cms);                          

              return res.json({
                speech: 'evaluate',
                source: 'drinkabout-evaluation',
                displayText: 'evaluate'
              });             
            }
          }
        }

        return res.json({
            speech: speech,
            source: 'drinkabout-webhook',
            displayText: speech
        });

    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});





