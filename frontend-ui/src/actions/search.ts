export function aiSearch(query: string): Promise<string> {
  return new Promise((resolve) => setTimeout(resolve, 2000))
      .then(() => console.log(`Searching for ${query}...`))
      .then(() => `Results for ${query}`);
}
