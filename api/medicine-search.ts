import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TinyFish } from "@tiny-fish/sdk";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const medicine = String(req.body?.medicine ?? "").trim();

  if (!medicine || medicine.length > 100) {
    return res.status(400).json({
      error: "Please enter a valid medicine name.",
    });
  }

  const apiKey = process.env.TINYFISH_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Medicine search is not configured.",
    });
  }

  try {
    const client = new TinyFish({ apiKey });

    const response = await client.search.query({
      query: `${medicine} official patient information leaflet India`,
      location: "IN",
      language: "en",
    });

    const results = (response.results ?? [])
      .slice(0, 8)
      .map((result: any) => ({
        title: result.title,
        url: result.url,
      }))
      .filter(
        (result: { title?: string; url?: string }) =>
          typeof result.title === "string" &&
          typeof result.url === "string" &&
          result.url.startsWith("https://")
      );

    return res.status(200).json({
      results,
      disclaimer:
        "Search results are for information only, not medical advice. Consult a pharmacist or clinician about medicine use, dosage, and safety.",
    });
  } catch (error) {
    console.error("TinyFish search failed:", error);

    return res.status(502).json({
      error: "Medicine information could not be retrieved. Please try again.",
    });
  }
}