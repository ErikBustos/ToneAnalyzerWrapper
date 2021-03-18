// Imports
const express = require('express')
const cors = require('cors')
require('dotenv').config();

const { json, urlencoded } = express


const app = express()
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// Port Config
const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || "0.0.0.0"

// server config
app.use(json())
app.use(urlencoded({ extended: false }))
const corsOptions = { origin: '*', optionsSuccessStatus: 200 }
app.use(cors(corsOptions))

//toneAnalyzer setup.
const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
      apikey: `${process.env.ToneAnalyzerAPIkey}`,
    }),
    serviceUrl: `${process.env.APIURL}`,
  });

//Base Get method
app.get('/', (req, res) =>{
    res.send('Examen Cloud. Tone Analyzer Microservice');
})

//Get method to get the author details
app.get('/autor', (req, res) => {
    res.send({
        alumno: 'EBM',
        servicio: 'Cloud Foundry en IBM Cloud'
    })
});

//Post Method to use tone Analyzer API.
app.post('/analyze', (req,res) => {
    let { input } = req.body;
    
    const toneParams = {
        toneInput: { 'text': input },
        contentType: 'application/json',   
    }

    toneAnalyzer.tone(toneParams)
    .then(toneAnalysis => {
        //console.log(JSON.stringify(toneAnalysis, null, 2));
        res.json(toneAnalysis.result.document_tone.tones);
    })
    .catch(err => {
        res.json(err);
        console.log('error:', err);
    });

})

// iniciamos nuestro server
app.listen(PORT,HOST, () => { console.log(`Server listening on port ${PORT} and host ${HOST}`); })