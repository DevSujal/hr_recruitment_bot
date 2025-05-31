import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
import path from "path"
import { fileURLToPath } from 'url';
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Workaround to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const getResponseFromOpenAi = async (query) => {
  const response = await client.responses.create({
    model: "gpt-4o",
    instructions: "you are an HR recruiting bot.",
    input: query,
  });

  return response.output_text;
};

// Serve static files (like index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Optional: route to serve index.html explicitly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/get-response", async (req, res) => {
  const { query } = await req.body;
  console.log(query);
  const response = await getResponseFromOpenAi(query);
  console.log(response);
  return res
    .json({
      response,
    })
    .status(200);
});

app.listen(process.env.PORT, () => {
  console.log("app is listening on port", process.env.PORT);
});
