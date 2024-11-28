const express = require('express');
const axios = require('axios');
const {
  generateContentModelFromPrompt,
} = require('./generateContentModelFromPrompt.js'); // Import the helper function
const convertSchema = require('./convertSchema.js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Function to delay between requests to avoid rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to send a request to the AI model
const sendRequest = async (chunkData, apiKey) => {
  const url = 'https://api.groq.com/openai/v1/chat/completions'; // API endpoint for Groq (update if necessary)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.post(
      url,
      {
        model: 'llama3-8b-8192', // Update with the appropriate model name
        messages: [
          {
            role: 'user',
            content: `
          Analyze the following content model and suggest improvements categorized under **Performance**, **Feasibility**, and **Efficiency**. Additionally, provide a proposed **Optimized Content Type Structure**:

          ${chunkData}
        `,
          },
        ],
      },
      { headers }
    );

    return response.data; // Return the model's response
  } catch (error) {
    console.error('Error during request:', error);
    return null;
  }
};

// Function to chunk content model to prevent sending large data in one request
const chunkContentModel = (contentModel, maxFields = 20) => {
  const schema = contentModel.schema || [];
  const chunks = [];
  for (let i = 0; i < schema.length; i += maxFields) {
    chunks.push({
      ...contentModel,
      schema: schema.slice(i, i + maxFields),
    });
  }
  return chunks;
};

// Endpoint to analyze content model sent from the frontend
app.post('/validate', async (req, res) => {
  // console.info("req?.body",req?.body)
  const contentModel = req.body;
  const apiKey = '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'; // Load the API key securely

  if (!contentModel) {
    return res.status(400).json({ error: 'Content model is required' });
  }

  // Embed the rules directly into the AI request
  const rules = `
    1. Single Line Textbox fields are ideal for small plain text entries.
    2. Multi Line Textbox fields are used for larger chunks of text.
    3. Titles should be concise and unique.
    4. JSON Rich Text Editors provide structured output and scalability.
    5. Avoid excessive nesting of schemas.
    6. Reference fields should be limited for efficiency.
  `;

  // Chunk content model for processing
  const chunks = chunkContentModel(contentModel);

  let allSuggestions = [];
  for (let [index, chunk] of chunks.entries()) {
    console.log(`Processing chunk ${index + 1} of ${chunks.length}`);

    const chunkData = JSON.stringify(chunk, null, 2);
    const suggestions = await sendRequest(chunkData, apiKey);
    if (suggestions && suggestions.choices && suggestions.choices.length > 0) {
      allSuggestions.push(suggestions.choices[0].message.content);
    } else {
      console.error(`Failed to process chunk ${index + 1}`);
    }

    await delay(1000); // Adjust based on API rate limits
  }
  // Combine all suggestions into a single response
  const combinedSuggestions = allSuggestions.join('\n\n');
  return res.json({ suggestions: combinedSuggestions });
});

app.post('/generate', async (req, res) => {
  const contentModels = req.body;
  const apiKey = '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'; // Load the API key securely
  if (!contentModels) {
    return res.status(400).json({ error: 'Content model is required' });
  }

  try {
    // Generate content model based on the user prompt
    const contentModel = await generateContentModelFromPrompt(
      contentModels,
      apiKey
    );

    if (contentModel) {
      console.log('contentModel', contentModel);
      return convertSchema(res.json({ contentModel }));
      // return res.json({ contentModel });
    } else {
      return res
        .status(500)
        .json({ error: 'Failed to generate content model' });
    }
  } catch (error) {
    console.error('Error generating content model:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
