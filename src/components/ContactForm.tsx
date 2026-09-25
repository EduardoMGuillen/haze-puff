"use client";

import { FormEvent, useState } from "react";
import { whatsappChatUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = `Hola, soy ${name.trim()}.
Teléfono: ${phone.trim()}

${message.trim()}

— Enviado desde Haze Puff`;
    window.open(whatsappChatUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact" onSubmit={onSubmit}>
      <label>
        <span>Nombre</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
        />
      </label>
      <label>
        <span>Teléfono</span>
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          inputMode="tel"
        />
      </label>
      <label>
        <span>Mensaje</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      <button className="btn btn-wa" type="submit">
        Enviar por WhatsApp
      </button>
    </form>
  );
}
