const cosineSimilarity = (vec1, vec2) => {
    const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
  };
  
  async function getRelevantChunks(query, model, chunks, embeddings) {
    const queryEmbedding = await model.embed(query).arraySync()[0];
    const similarities = embeddings.map((embed) =>
      cosineSimilarity(queryEmbedding, embed)
    );
  
    // Sort by similarity and return top 3 chunks
    return chunks
      .map((chunk, idx) => ({ chunk, similarity: similarities[idx] }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((item) => item.chunk);
  }
  