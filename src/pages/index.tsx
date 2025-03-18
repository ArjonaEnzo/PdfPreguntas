import { useEffect, useState } from "react";

interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
      {data ? (
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
