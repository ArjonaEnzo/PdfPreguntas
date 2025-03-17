import { useEffect, useState } from "react";

interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<ApiResponse> => {
    const response = await fetch("/api/data");

    // Verifica si la respuesta es un JSON válido
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta no es un JSON válido");
    }

    return response.json();
  };

  useEffect(() => {
    fetchData()
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
      });
  }, []);

  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data ? (
        <div>
          <p>ID: {data.id}</p>
          <p>Nombre: {data.name}</p>
          <p>Email: {data.email}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
