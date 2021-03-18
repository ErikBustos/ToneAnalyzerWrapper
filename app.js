// importamos las librerias importantes
const express = require('express')
const cors = require('cors')
require('dotenv').config();

// importamos el router
//const router = require('./src/routes')
const ejercicios = require('./src/routes/index')
// de express nos traemos lo necesario
const { json, urlencoded } = express

// creamos nuestra app
const app = express()
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// definimos un puerto por el cual escucharemos peticiones
const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || "0.0.0.0"

// configuraciones para nuestro server
app.use(json())
app.use(urlencoded({ extended: false }))
const corsOptions = { origin: '*', optionsSuccessStatus: 200 }
app.use(cors(corsOptions))

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
      apikey: `${process.env.ToneAnalyzerAPIkey}`,
    }),
    serviceUrl: `${process.env.APIURL}`,
  });

app.get('/', (req, res) =>{
    res.send('Examen Cloud. Tone Analyzer Microservice');
})

app.get('/autor', (req, res) => {
    res.send({
        alumno: 'EBM',
        servicio: 'Cloud Foundry en IBM Cloud'
    })
});

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

// indicamos que usaremos un router
//app.use(router)
//app.use('/',ejercicios)
// iniciamos nuestro server
app.listen(PORT,HOST, () => { console.log(`Server listening on port ${PORT} and host ${HOST}`); })