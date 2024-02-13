const admin = require('firebase-admin');
var express = require('express');
var router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

/* GET random prompt */

module.exports = router.get('/', async function(req, res, next) {

    try{
        // Initialize Model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        // Set Prompt

        const prompt = 'Te llamas Financify, eres un bot de finanzas y este es un prompt automatico, saluda a los clientes de mi app y diles que estas a la disposicion';

        // Make Request to AI Model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Render View 
        res.render('prompt', { title: 'Financify', text: text });
    }
    catch(err){
        console.error(err)
        res.status(500).send('Error interno del servidor');
    }

});

module.exports = router.get('/:userInput/:uid', async function(req, res, next) {

    const auth = admin.auth();
    const { uid, userInput } = req.params ;

    try {
        const userRecord = await auth.getUser(uid);

        // Extracts user info

        const { email } = userRecord;

        // Initializes model.
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        // Sets the prompt as the user input.
        const prompt = userInput; 

        // Awaits for Google Gemini-Pro Model to return the text.
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extracts text form response.
        const text = response.text();

        //Renders the view with the new text.

        res.render('prompt', { title: 'ChaPejete', user: email, search: userInput, text: text });
    } catch (err) {
        //If there is any error, throw it on console and 
        if (err.code === 'auth/user-not-found') {
            res.render('error',{errorTitle: `We're sorry :(`, errorCode: err.code, errorText: err.message + ` Please, Log In or Sign Up.`})
        } else {
            console.error('Error al verificar el UID:', error);
            throw err;
        }
    }
    

})





