import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

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
