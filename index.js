const app = require('./src/routes');
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Epicalendar V2 started on port ${port}`);
});