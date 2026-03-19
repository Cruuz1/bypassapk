const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/api/login-key", async (req, res) => {
    const key = req.body.licenseKey;

    try {
        const response = await axios.post("https://keyauth.win/api/1.2/", {
            type: "license",
            key: key,
            name: "Cruuzuid",
            ownerid: "y5tsaoFToV",
            version: "1.0"
        });

        if (response.data.success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (e) {
        res.json({ success: false });
    }
});

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.listen(3000, () => console.log("Server running"));