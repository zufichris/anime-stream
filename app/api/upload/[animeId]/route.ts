// /api/upload/[animeId]

import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [".mp4", ".mkv", ".avi"];
const UPLOADS_DIR = "public";

export async function POST(
  request: NextRequest,
  { params }: { params: { animeId: string } }
) {
  try {
    const data = await request.formData();
    const animeId = params.animeId;
    const files: File[] = data.getAll("files") as unknown as File[];

    // Validate anime ID
    if (!animeId || !/^\d+$/.test(animeId.toString())) {
      return NextResponse.json(
        { success: false, message: "Invalid anime ID" },
        { status: 400 }
      );
    }

    // Validate files
    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_TYPES.includes(ext)) {
        return NextResponse.json(
          { success: false, message: `Invalid file type: ${ext}` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: `File too large: ${file.name}` },
          { status: 400 }
        );
      }
    }

    const uploadDir = path.join(UPLOADS_DIR, animeId.toString());
    await mkdir(uploadDir, { recursive: true });

    // Process files
    const uploaded = await Promise.all(
      files.map(async (file, i) => {
        const fileName = `ep${i + 1}.${file.name.split(".")[1]}`;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const sanitizedName = path
          .basename(`${animeId}/${fileName}`)
          .replace(/[^a-zA-Z0-9.-]/g, "_");

        await writeFile(`${uploadDir}/${sanitizedName}`, buffer);
        return { uploadDir };
      })
    );

    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      uploaded,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { animeId: string } }
// ) {
//   try {
//     const animeId = params.animeId;
//     const { searchParams } = new URL(request.url);
//     const episodeNumber = searchParams.get("EP");

//     if (!animeId || !episodeNumber) {
//       return NextResponse.json(
//         { success: false, message: "Missing required parameters" },
//         { status: 400 }
//       );
//     }

//     const dirPath = path.join(UPLOADS_DIR, animeId);

//     // Find the episode file
//     if (!existsSync(dirPath)) {
//       return NextResponse.json(
//         { success: false, message: "Anime directory not found" },
//         { status: 404 }
//       );
//     }

//     // Get all files in the directory and find the matching episode
//     const files = await readdir(dirPath);
//     const episodeFile = files.find(
//       (file) =>
//         file.toLowerCase().includes(`ep${episodeNumber}`) ||
//         file.toLowerCase().includes(`episode${episodeNumber}`)
//     );

//     if (!episodeFile) {
//       return NextResponse.json(
//         { success: false, message: "Episode not found" },
//         { status: 404 }
//       );
//     }

//     const filePath = path.join(dirPath, episodeFile);
//     const fileStat = await stat(filePath);
//     const fileSize = fileStat.size;

//     const range = request.headers.get("range");

//     if (range) {
//       // Handle range requests for video streaming
//       const parts = range.replace(/bytes=/, "").split("-");
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//       // const chunkSize = end - start + 1;

//       const file = await readFile(filePath);
//       const chunk = file.slice(start, end + 1);

//       // const headers = {
//       //   "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//       //   "Accept-Ranges": "bytes",
//       //   "Content-Length": chunkSize,
//       //   "Content-Type": "video/mp4", // Adjust based on file type
//       // };

//       return new NextResponse(chunk, {
//         status: 206,
//       });
//     } else {
//       // Handle non-range requests
//       const file = await readFile(filePath);
//       // const headers = {
//       //   "Content-Length": fileSize,
//       //   "Content-Type": "video/mp4", // Adjust based on file type
//       // };

//       return new NextResponse(file, {
//         status: 200,
//       });
//     }
//   } catch (error) {
//     console.error("Streaming error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error ? error.message : "Error streaming episode",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export const dynamic = "force-dynamic";
