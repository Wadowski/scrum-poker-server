const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const namespaceHandlers = require('./src/namespaceHandlers');

const PORT = process.env.PORT || 4101;

namespaceHandlers(io);

app.get('/', (req, res) => {
    res.send('server');
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
