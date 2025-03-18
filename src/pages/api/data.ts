import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Simula una respuesta JSON
    const data = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };

    res.status(200).json(data);
  } else {
    // Maneja otros métodos HTTP
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
