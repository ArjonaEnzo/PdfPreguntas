import { useEffect, useState } from "react";

// Definimos una interfaz para la estructura del usuario
interface User {
  id: number;
  name: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  // Simulamos la obtención de datos del usuario
  useEffect(() => {
    // Datos de ejemplo (podrías reemplazar esto con una llamada a una API)
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };

    // Simulamos un retraso en la carga de datos
    setTimeout(() => {
      setUser(mockUser);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Perfil del Usuario</h1>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}
