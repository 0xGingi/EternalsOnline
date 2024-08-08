const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 3013;

let cache = {};
let cacheLifetime = 5 * 60 * 1000; // 5 minutes

app.use(express.static(path.join(__dirname, 'public')));

app.get('/leaderboard/:endpoint', async (req, res) => {
    const endpoint = req.params.endpoint;

    if (cache[endpoint] && (Date.now() - cache[endpoint].timestamp < cacheLifetime)) {
        res.json(cache[endpoint].data);
        return;
    }
    try {
    const response = await fetch(`https://api.flipmmo.com/leaderboard/${endpoint}`);
    const data = await response.json();

    cache[endpoint] = {
        data: data,
        timestamp: Date.now()
    };

    res.json(data);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data from the API' });
}
});

async function parseAndFilterData(response, minPrice, maxPrice) {
    const data = await response.json();
    return data.market.filter(item => item.price >= minPrice && item.price <= maxPrice);
}

app.get('/api/:endpoint', async (req, res) => {
    const endpoint = req.params.endpoint;
    const { minPrice, maxPrice } = req.query;

    try {
        const response = await fetch(`https://api.flipmmo.com/${endpoint}`);
        const filteredData = await parseAndFilterData(response, parseInt(minPrice), parseInt(maxPrice));

        cache[endpoint] = {
            data: filteredData,
            timestamp: Date.now()
        };

        res.json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data from the API' });
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/fishing', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'fishing.html'));
});
app.get('/agility', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'agility.html'));
});
app.get('/coins', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'coins.html'));
});
app.get('/cooking', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'cooking.html'));
});
app.get('/crafting', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'crafting.html'));
});
app.get('/elo', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'elo.html'));
});
app.get('/guilds', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'guilds.html'));
});
app.get('/kills', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'kills.html'));
});
app.get('/magic', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'magic.html'));
});
app.get('/mining', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'mining.html'));
});
app.get('/smithing', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'smithing.html'));
});
app.get('/taming', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'taming.html'));
});
app.get('/woodcutting', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'woodcutting.html'));
});
app.get('/xp', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'xp.html'));
});
app.get('/petelo', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'petelo.html'));
});
app.get('/slayer', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'slayer.html'));
});
app.get('/farming', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'farming.html'));
});
app.get('/tower', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'tower.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});