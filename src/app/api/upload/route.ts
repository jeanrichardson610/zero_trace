import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 })
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return Response.json({
      url: blob.url,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}