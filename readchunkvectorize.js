const fs = require("fs");
require('@tensorflow/tfjs-node');
const use = require("@tensorflow-models/universal-sentence-encoder");

async function preprocessDocument(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const chunks = data.match(/.{1,500}/g); // Chunk into 500-character pieces

  const model = await use.load();
  const embeddings = await model.embed(chunks);

  // Store embeddings and chunks for retrieval
  return { chunks, embeddings: embeddings.arraySync() };
}

// Preprocess document.txt
preprocessDocument("document.txt").then(({ chunks, embeddings }) => {
  fs.writeFileSync("chunks.json", JSON.stringify(chunks));
  fs.writeFileSync("embeddings.json", JSON.stringify(embeddings));
});
