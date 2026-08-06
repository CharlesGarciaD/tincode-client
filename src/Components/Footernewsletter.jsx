import { useState } from "react";
import { apiFetch } from "../Services/ApiClient";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Escribe un correo válido.");
      return;
    }

    try {
      setStatus("loading");
      const res = await apiFetch("/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo completar la suscripción.");
      }

      setStatus("success");
      setMessage(data.message || "¡Listo! Ya estás suscrito.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="tc-footer-newsletter">
      <h4 className="tc-footer-newsletter__heading">Newsletter</h4>
      <p className="tc-footer-newsletter__desc">
        Recibe artículos nuevos y cursos recién publicados. Sin spam.
      </p>

      <form onSubmit={handleSubmit} className="tc-footer-newsletter__terminal">
        <div className="tc-footer-newsletter__terminal-bar">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="tc-footer-newsletter__terminal-body">
          <span className="tc-footer-newsletter__prompt">$ suscribir --email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            disabled={status === "loading"}
            className="tc-footer-newsletter__input"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="tc-footer-newsletter__submit"
          >
            {status === "loading" ? "enviando…" : "enter ↵"}
          </button>
        </div>
      </form>

      {status === "success" && (
        <p className="tc-footer-newsletter__feedback tc-footer-newsletter__feedback--ok">
          ✓ {message}
        </p>
      )}
      {status === "error" && (
        <p className="tc-footer-newsletter__feedback tc-footer-newsletter__feedback--error">
          ✕ {message}
        </p>
      )}
    </div>
  );
}
