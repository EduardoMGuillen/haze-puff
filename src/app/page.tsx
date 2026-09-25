import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/components/Products";
import ShopMap from "@/components/ShopMap";
import ContactForm from "@/components/ContactForm";
import { CONTACT, INSTAGRAM_URL, SHOP } from "@/lib/constants";
import { getProducts } from "@/lib/products";
import { whatsappChatUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Desechables",
  "Pods",
  "Líquidos",
  "Accesorios",
  "Cofradía",
  "Cortés",
  "Haze Puff",
  "WhatsApp",
  "+18",
];

const STEPS = [
  {
    n: "01",
    title: "Elige",
    text: "Revisa el catálogo y el producto que te interesa.",
  },
  {
    n: "02",
    title: "Escríbenos",
    text: "Comprar abre WhatsApp con el nombre del producto y el enlace.",
  },
  {
    n: "03",
    title: "Recoge",
    text: "Coordinamos la entrega o el retiro en la tienda de Cofradía.",
  },
];

const FAQS = [
  {
    q: "¿Dónde están?",
    a: "En Cofradía, Cortés, Honduras. El mapa de esta página marca el punto. Si necesitas indicaciones, escríbenos.",
  },
  {
    q: "¿Cómo compro?",
    a: "El botón Comprar abre un chat de WhatsApp al +504 8844-5272 con el producto elegido.",
  },
  {
    q: "¿Los precios son finales?",
    a: "Son de referencia. El inventario cambia, así que confirmamos disponibilidad y precio en el chat.",
  },
  {
    q: "¿A partir de qué edad?",
    a: "La venta es solo para mayores de 18 años.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const chat = whatsappChatUrl(
    "Hola, quiero información de Haze Puff en Cofradía.",
  );

  return (
    <div className="page">
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Cofradía · Cortés</p>
          <img className="hero-logo" src="/logo.png" alt="Haze Puff" />
          <h1 className="display">
            Tienda de <span>vapes</span>
          </h1>
          <p>
            Desechables, pods y líquidos en Cofradía. Elige en el catálogo y
            pide por WhatsApp.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#tienda">
              Ver tienda
            </a>
            <a className="btn btn-ghost" href={chat} target="_blank" rel="noreferrer">
              Escribir ahora
            </a>
          </div>
          <p className="hero-hint">Solo mayores de 18 años</p>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[0, 1].map((loop) => (
            <span key={loop} style={{ display: "flex", gap: "2.2rem" }}>
              {MARQUEE.map((item) => (
                <span key={`${loop}-${item}`}>{item} ·</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Products products={products} />

      <section className="section" id="nosotros">
        <div className="wrap split">
          <div>
            <p className="section-kicker">La tienda</p>
            <h2 className="display">Haze en Cofradía</h2>
            <p className="lede">
              Haze Puff es una tienda de vapes en Cofradía, Cortés. El catálogo
              lo actualizamos desde el panel: lo que ves aquí es lo que hay
              para pedir.
            </p>
            <ul className="checks">
              <li>Pedidos directos por WhatsApp {CONTACT.phoneDisplay}</li>
              <li>
                Instagram{" "}
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  @h4zepuff
                </a>
              </li>
              <li>Venta únicamente a mayores de 18 años</li>
            </ul>
          </div>
          <div className="about-visual">
            <img src="/logo.png" alt="" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="section-kicker">Cómo va</p>
          <h2 className="display">Del catálogo al chat</h2>
          <div className="steps">
            {STEPS.map((step) => (
              <article key={step.n} className="step">
                <div className="n">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="ubicacion">
        <div className="wrap">
          <p className="section-kicker">Mapa</p>
          <h2 className="display">Cofradía, Cortés</h2>
          <p className="lede">
            {SHOP.city}, {SHOP.country}. Mueve el mapa o abre la ruta en
            Google Maps.
          </p>
          <div className="map-layout">
            <div className="card">
              <h3>Haze Puff</h3>
              <p>{CONTACT.address}</p>
              <p style={{ marginTop: "0.8rem" }}>
                <a className="btn" href={SHOP.mapsUrl} target="_blank" rel="noreferrer">
                  Cómo llegar
                </a>
              </p>
            </div>
            <ShopMap />
          </div>
        </div>
      </section>

      <section className="section" id="contacto">
        <div className="wrap">
          <p className="section-kicker">Contacto</p>
          <h2 className="display">Escríbenos</h2>
          <div className="contact-grid">
            <div>
              <p className="lede">
                El formulario abre WhatsApp con tu mensaje listo para{" "}
                {CONTACT.phoneDisplay}.
              </p>
              <p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram @h4zepuff
                </a>
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="section-kicker">Preguntas</p>
          <h2 className="display">Antes de pasar</h2>
          <div className="faq">
            {FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="wrap">
          <p className="section-kicker">{SHOP.city}</p>
          <h2 className="display">¿Ya elegiste?</h2>
          <p>Mándanos el producto por WhatsApp y te confirmamos si está.</p>
          <a className="btn btn-wa" href={chat} target="_blank" rel="noreferrer">
            Escribir a {CONTACT.phoneDisplay}
          </a>
        </div>
      </section>
      <Footer />
      <a
        className="wa-float"
        href={chat}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.42-.13-.95-.3-1.64-.59-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.4 1.02-.4.12 0 .23 0 .33.01.3.01.44.03.64.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.19-.15.31-.29.48-.14.16-.3.37-.43.49-.14.13-.29.28-.12.54.16.26.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.27.37-.23.62-.14.26.1 1.62.76 1.9.9.28.14.46.21.53.32.07.13.07.74-.17 1.42z"
          />
        </svg>
      </a>
    </div>
  );
}
