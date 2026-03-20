// /api/upload.ts
import { redis } from "@/lib/redis"
import { nanoid } from "nanoid"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get("file") as File | null

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file" }),
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString("base64")

    const key = `file:${nanoid()}`

    await redis.set(key, base64, { ex: 60 * 10 })

    const url = `data:${file.type};base64,${base64}`

    return new Response(
      JSON.stringify({ url, key }),
      { status: 200 }
    )
  } catch (err) {
    console.error(err)

    return new Response(
      JSON.stringify({ error: "Upload failed" }),
      { status: 500 }
    )
  }
}