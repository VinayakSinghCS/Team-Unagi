const express = require("express");
// const fetch = require("node-fetch");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Local GROQ API endpoint
const groqApiKey = "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"; // Replace with your API key
const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions"; // Replace with your GROQ API endpoint

// Endpoint to forward GROQ queries
app.post("/groq", async (req, res) => {
  console.log("::: req.body", req.body.query);

  const groqQuery = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "user",
        content: req.body.query,
      },
    ],
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: false,
  };

  console.log("::: groqQuery", groqQuery);

  if (!groqQuery) {
    return res.status(400).json({ error: "GROQ query is required." });
  }

  axios
    .post(groqEndpoint, groqQuery, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
    })
    .then((response) => {
      console.log("::: response :::", response.data.choices[0].message.content);
      res.json(response.data.choices[0].message.content);
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });

  //   try {
  //     const response = await fetch(groqEndpoint, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${groqApiKey}`,
  //       },
  //       body: JSON.stringify({ query: groqQuery }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`GROQ API error: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     res.json(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //     res.status(500).json({ error: "Failed to fetch data from GROQ API." });
  //   }
});

// Start the server
app.listen(PORT, () => {
  console.log(`GROQ API forwarder running at http://localhost:${PORT}`);
});
