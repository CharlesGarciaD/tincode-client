import { useParams, Link } from "react-router-dom";

const posts = [
  { id: 1, titulo: "Mi primer post", contenido: "Este es el contenido completo del primer artículo del blog." },
  { id: 2, titulo: "Aprendiendo React Router", contenido: "Cómo organicé las rutas de mi proyecto personal." },
  { id: 3, titulo: "Trabajando con Lodash", contenido: "Por qué uso map de Lodash en vez del map nativo." },
];

export function Post() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="ui container" style={{ marginTop: "40px" }}>
        <h1 className="ui header">Artículo no encontrado</h1>
        <Link to="/blog">Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="ui container" style={{ marginTop: "40px" }}>
      <h1 className="ui header">{post.titulo}</h1>
      <div className="ui segment">
        <p>{post.contenido}</p>
      </div>
      <Link to="/blog">← Volver al Blog</Link>
    </div>
  );
}