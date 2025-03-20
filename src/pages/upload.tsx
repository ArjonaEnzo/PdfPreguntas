import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subir directamente a Cloudinary
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona un archivo PDF");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Crear FormData para enviar a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      // Subir el archivo directamente a Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok)
        throw new Error(cloudinaryData.error?.message || "Error en Cloudinary");

      // Guardar en Supabase
      const { error: supabaseError } = await supabase.from("pdfs").insert([
        {
          url: cloudinaryData.secure_url,
          name: file.name,
          created_at: new Date().toISOString(),
        },
      ]);

      if (supabaseError) throw supabaseError;

      alert("PDF subido exitosamente!");
      setFile(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al subir el PDF. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Subir PDF</h1>

      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Subiendo..." : "Subir PDF"}
        </button>

        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </div>
  );
}
