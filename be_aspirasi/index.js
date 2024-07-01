const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`BE ASPIRASI system is running on port http://localhost:${port}`);
});


