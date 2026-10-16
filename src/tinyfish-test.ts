import "dotenv/config";
import { TinyFish } from "@tiny-fish/sdk";

async function main() {
  const apiKey = process.env.TINYFISH_API_KEY;

  if (!apiKey) {
    throw new Error("TINYFISH_API_KEY is missing from .env");
  }

  const client = new TinyFish({ apiKey });

  console.log("Connecting to TinyFish...");

  const response = await client.search.query({
    query: "official medicine information patient leaflet India",
    location: "IN",
    language: "en",
  });

  console.log("\nSearch results:");

  response.results.forEach((result) => {
    console.log("-", result.title);
    console.log(" ", result.url);
  });
}

main().catch((error) => {
  console.error("TinyFish test failed:", error);
});