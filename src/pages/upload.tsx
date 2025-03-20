/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuración de Cloudinary
  const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  };

  // Manejar la subida del PDF
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona un archivo PDF");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Crear el FormData para enviar el archivo a la API
      const formData = new FormData();
      formData.append("file", file);

      // Hacer la petición a la API de subida
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Verificar si la respuesta es un JSON válido
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const errorData = await response.text(); // Obtener el mensaje de error
        throw new Error(errorData || "La respuesta no es válida");
      }

      const data = await response.json();
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
