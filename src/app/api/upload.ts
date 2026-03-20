// /api/upload.ts
import { IncomingForm, File } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

// Disable built-in body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Strongly type the files
type FormidableFile = File & { filepath: string; mimetype: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    // Type assertion for TS
    const file = (files?.file as unknown as FormidableFile) || null;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Read file as Base64
    const data = fs.readFileSync(file.filepath);
    const base64 = data.toString("base64");

    // Generate a unique key
    const key = `file:${nanoid()}`;

    // Store in Redis with TTL (10 minutes)
    await redis.set(key, base64, { ex: 60 * 10 });

    // Return a "data URL" that can be used directly in <img>
    const mimeType = file.mimetype || "application/octet-stream";
    const url = `data:${mimeType};base64,${base64}`;

    return res.status(200).json({ url, key });
  });
}