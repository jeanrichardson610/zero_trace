import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 })
    }

   // ✅ Validate file type
    const allowed = ["image/png", "image/jpeg", "image/gif"]
    if (!allowed.includes(file.type)) {
      return Response.json({ error: "File type not allowed" }, { status: 400 })
    }

    // ✅ Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "File too large" }, { status: 400 })
    }

    // ✅ Generate unique name and upload
    const uniqueName = Date.now() + "-" + file.name
    const blob = await put(uniqueName, file, { access: "public" })

    return Response.json({
      url: blob.url,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}