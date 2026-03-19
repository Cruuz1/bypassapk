const express = require("express");
const axios = require("axios");
const qs = require("querystring");

const app = express();
app.use(express.json());

const APP_NAME = "Cruuzuid";
const OWNER_ID = "y5tsaoFToV";
const VERSION = "1.0";

app.get("/", (_req, res) => {
  res.send("Backend funcionando");
});

app.post("/api/login-key", async (req, res) => {
  const key = (req.body.licenseKey || "").trim();

  if (!key) {
    return res.json({ success: false, stage: "input", message: "missing key" });
  }

  try {
    // INIT: siguiendo el estilo de payload de los ejemplos oficiales
    const initBody = qs.stringify({
      type: "init",
      name: APP_NAME,
      ownerid: OWNER_ID,
      ver: VERSION,
      hash: "backend"
    });

    const initResp = await axios.post(
      "https://keyauth.win/api/1.2/",
      initBody,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000
      }
    );

    console.log("INIT RESPONSE:", initResp.data);

    if (!initResp.data || !initResp.data.success || !initResp.data.sessionid) {
      return res.json({
        success: false,
        stage: "init",
        response: initResp.data || null
      });
    }

    const sessionid = initResp.data.sessionid;

    // LICENSE
    const licenseBody = qs.stringify({
      type: "license",
      key: key,
      sessionid: sessionid,
      name: APP_NAME,
      ownerid: OWNER_ID
    });

    const licenseResp = await axios.post(
      "https://keyauth.win/api/1.2/",
      licenseBody,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000
      }
    );

    console.log("LICENSE RESPONSE:", licenseResp.data);

    return res.json({
      success: !!licenseResp.data?.success,
      stage: "license",
      response: licenseResp.data || null
    });
  } catch (e) {
    console.log("BACKEND ERROR:", e.response?.data || e.message);
    return res.json({
      success: false,
      stage: "exception",
      message: e.response?.data || e.message
    });
  }
});

app.listen(3000, () => console.log("Server running"));
