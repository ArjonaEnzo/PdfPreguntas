import { useEffect, useState } from "react";

// Definimos una interfaz para la estructura de los datos que esperamos recibir
interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);

  // Función para obtener los datos de la API
  const fetchData = async (): Promise<ApiResponse> => {
    const response = await fetch("/api/data");
    const result = await response.json();
    return result;
  };

  // Efecto para cargar los datos cuando el componente se monta
  useEffect(() => {
    fetchData()
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
