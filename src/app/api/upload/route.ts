import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    console.log("Upload route hit")
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    console.log("File received:", file?.name)

    if (!file) {
      console.log("No file found in formData")
      return Response.json({ error: "No file" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = Date.now() + "-" + file.name
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    console.log("Upload dir:", uploadDir)
    const filePath = path.join(uploadDir, fileName)
    console.log("Saving file to:", filePath)

    await writeFile(filePath, buffer)
    console.log("File saved successfully")

    return Response.json({ url: "/uploads/" + fileName })
  } catch (err) {
    console.error("Upload failed:", err)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}