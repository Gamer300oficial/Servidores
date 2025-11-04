
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir que Roblox (u otros) hagan peticiones a tu servidor
app.use(cors());

// Endpoint para obtener servidores públicos
app.get("/servidores/:placeId", async (req, res) => {
  const { placeId } = req.params;
  const url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=100`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al contactar con Roblox: ${response.status}`);
    }

    const data = await response.json();

    // Filtramos solo la info que necesitamos
    const servidores = data.data.map((s) => ({
      id: s.id,
      jugadores: s.playing,
      maxJugadores: s.maxPlayers,
      ping: s.ping || 0,
    }));

    res.json({ servidores });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error al obtener servidores de Roblox" });
  }
});

app.get("/", (req, res) => {
  res.send("🌍 Servidor de listado de instancias Roblox funcionando correctamente.");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
