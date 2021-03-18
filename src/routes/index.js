const router = require('express').Router();

const urlToneAnalyzer = 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/b1e18a7f-9c98-426c-b3d8-839d5b9da123';

router.get('/', (req, res) =>{
    res.send('Examen de cloud ');
})

//autor get
router.get('/autor', (req, res) => {
    res.send({
        alumno: 'EBM',
        servicio: 'Cloud Foundry en IBM Cloud'
    })
});

router.post('/analyze', (req,res) => {
    let { input } = req.body;
    
    let endpoint = "/v3/tone_chat?version=2017-09-21"
    fetch(urlToneAnalyzer + endpoint , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    })
    .then(res => res.json())
    .then(json => {
        res.status(202);
    })
    .catch(err => console.log(err));
})

module.exports = router;