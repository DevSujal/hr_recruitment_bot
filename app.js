import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Workaround to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getResponseFromOpenAi = async (query) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an HR recruiting bot."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to get response from OpenAI");
  }
};

// Serve static files (like index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Optional: route to serve index.html explicitly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/get-response", async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    console.log("Query:", query);
    const response = await getResponseFromOpenAi(query);
    console.log("Response:", response);
    
    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fixed port configuration - use || instead of |
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App is listening on port", PORT);
});