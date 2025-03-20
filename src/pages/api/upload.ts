import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import { createClient } from "@supabase/supabase-js";
import cloudinary from "cloudinary";

// ⚠️ Asegúrate de que Next.js está leyendo las variables de entorno
console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "OK" : "NO DEFINIDA"
);

// Configurar Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // <-- ¡Esto debe ser solo para backend!
  api_secret: process.env.CLOUDINARY_API_SECRET, // <-- ¡Esto debe ser solo para backend!
});

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar archivos en Next.js
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Método recibido:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Error al procesar el archivo:", err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (
      !file ||
      !(file as formidable.File).filepath ||
      (file as formidable.File).mimetype !== "application/pdf"
    ) {
      return res.status(400).json({ error: "Solo se permiten archivos PDF" });
    }

    try {
      // Subir el archivo a Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(
        (file as formidable.File).filepath,
        {
          resource_type: "raw",
          folder: "pdf_uploads",
        }
      );

      // Guardar metadatos en Supabase
      const { error: supabaseError } = await supabase.from("pdfs").insert([
        {
          url: uploadResponse.secure_url,
          filename: (file as formidable.File).originalFilename || "unknown.pdf",
          created_at: new Date().toISOString(),
        },
      ]);

      if (supabaseError) {
        console.error("Error en Supabase:", supabaseError);
        return res
          .status(500)
          .json({ error: "Error al guardar en la base de datos" });
      }

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error("Error al subir archivo:", error);
      return res.status(500).json({ error: "Fallo en la subida del archivo" });
    }
  });
}
