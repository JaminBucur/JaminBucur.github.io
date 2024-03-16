"use strict";
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

let categories = ['funnyJoke', 'lameJoke'];
let funnyJoke = [
    {
        'joke': 'Why did the student eat his homework?',
        'response': 'Because the teacher told him it was a piece of cake!'
    },
    {
        'joke': 'What kind of tree fits in your hand?',
        'response': 'A palm tree'
    },
    {
        'joke': 'What is worse than raining cats and dogs?',
        'response': 'Hailing taxis'
    }
];
let lameJoke = [
    {
        'joke': 'Which bear is the most condescending?',
        'response': 'Pan-DUH'
    },
    {
        'joke': 'What would the Terminator be called in his retirement?',
        'response': 'The Exterminator'
    }
];

// GET endpoint that responds with a list of possible categories in the jokebook.
app.get('/jokebook/categories', async (req, res) => {
    try {
        res.send(categories);
    } catch (err) {
        res.status(500).type('text').send('error!!');
    }
});

// GET endpoint that responds with all the jokes from the specified category.
app.get('/jokebook/joke/:category', (req, res) => {
    let category = req.params.category;
    let limit = req.query.limit;
    let jokes;
    if (category === 'funnyJoke') {
        jokes = funnyJoke;
    } else if (category === 'lameJoke') {
        jokes = lameJoke;
    } else {
        return res.status(400).json({ 'error': 'no category listed for ' + category });
    }
    if (limit) {
        jokes = jokes.slice(0, limit);
    }
    res.json(jokes);
});

// POST endpoint that adds a new joke to the specified category.
app.post('/jokebook/joke/new', (req, res) => {
    let { category, joke, response } = req.body;
    if (!category || !joke || !response || !categories.includes(category)) {
        return res.status(400).json({ 'error': 'invalid or insufficient user input' });
    }
    let newJoke = { joke, response };
    if (category === 'funnyJoke') {
        funnyJoke.push(newJoke);
    } else {
        lameJoke.push(newJoke);
    }
    res.json(newJoke);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);