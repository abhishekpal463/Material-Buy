const express = require('express');
const app = express();


const PORT = 3000 || process.env.PORT;

app.get("/", (req, res) => {
    res.json({ hii: "THis is express Running" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})