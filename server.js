const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const appname = "Cruuzuid";
const ownerid = "y5tsaoFToV";
const version = "1.0";

app.post("/api/login-key", async (req, res) => {
    const key = req.body.licenseKey;

    try {
        // 🔹 1. INIT
        const init = await axios.post("https://keyauth.win/api/1.2/", {
            type: "init",
            name: appname,
            ownerid: ownerid,
            version: version
        });

        if (!init.data.success) {
            return res.json({ success: false });
        }

        const sessionid = init.data.sessionid;

        // 🔹 2. LOGIN CON LICENSE
        const login = await axios.post("https://keyauth.win/api/1.2/", {
            type: "license",
            key: key,
            name: appname,
            ownerid: ownerid,
            sessionid: sessionid
        });

        if (login.data.success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (e) {
        console.log(e.message);
        res.json({ success: false });
    }
});

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.listen(3000, () => console.log("Server running"));
