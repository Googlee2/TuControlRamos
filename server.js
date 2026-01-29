import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 ACCESS TOKEN (PRIVADO – SOLO BACKEND)
const ACCESS_TOKEN = "APP_USR-5281050459713526-012817-a48f51cb9596a45449ddf2ff3982a966-3166344286";

app.post("/create-preference", async (req, res) => {
  try {
    const preference = {
      items: req.body.items,
      back_urls: {
        success: "https://googlee2.github.io/TuControlRamos/gracias.html",
        failure: "https://googlee2.github.io/TuControlRamos/error.html",
        pending: "https://googlee2.github.io/TuControlRamos/pendiente.html"
      },
      auto_return: "approved"
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preference)
      }
    );

    const data = await response.json();

    res.json({
      id: data.id,
      init_point: data.init_point
    });

  } catch (error) {
    console.error("ERROR MP:", error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

app.listen(3000, () => {
  console.log("🚀 SERVIDOR LEVANTADO EN PUERTO 3000");
});
