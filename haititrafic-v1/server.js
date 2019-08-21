const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

//server.listen(port);
//For newcomers: You can use 
//server.use(app); // app is imported from app.js
server.listen(port, () => {
  console.log(`App is listening on port ${port}!`)
});