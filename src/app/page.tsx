import Header, { InstagramIcon } from "@/components/Header";
import Footer from "@/components/Footer";
import Products from "@/components/Products";
import ShopMap from "@/components/ShopMap";
import ContactForm from "@/components/ContactForm";
import CategoryTiles from "@/components/CategoryTiles";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { CONTACT, INSTAGRAM_HANDLE, INSTAGRAM_URL, SHOP } from "@/lib/constants";
import { getProducts } from "@/lib/products";
import { whatsappChatUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Vapes",
  "Good vibes",
  "Better days",
  "Desechables",
  "Pods",
  "Líquidos",
  "Vapes HD",
  "Cofradía",
];

const FEATURES = [
  {
    title: "Pides por WhatsApp",
    text: "Tocas Comprar y el chat se abre con el producto listo. Sin registros ni carritos.",
  },
  {
    title: "Catálogo al día",
    text: "Lo que ves aquí lo actualizamos desde la tienda, con promos y novedades.",
  },
  {
    title: "Aquí en Cofradía",
    text: "Tienda local en Cofradía, Cortés. Coordinamos retiro o entrega por chat.",
  },
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
    q: "¿Hacen entregas?",
    a: "Escríbenos por WhatsApp y coordinamos retiro en tienda o entrega según tu zona.",
  },
  {
    q: "¿A partir de qué edad?",
    a: "La venta es solo para mayores de 18 años.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const active = products.filter((item) => item.active);
  const categoryCount = new Set(active.map((item) => item.category)).size;
  const chat = whatsappChatUrl(
    "Hola, quiero información de Haze Puff en Cofradía.",
  );

  return (
    <div className="page">
      <Header />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span className="dot" /> Cofradía · Cortés · Honduras
            </p>
            <h1 className="display">
              Tu tienda de <span>vapes</span> en Cofradía
            </h1>
            <p className="hero-lede">
              Desechables, pods, líquidos y Vapes HD. Elige en el catálogo y
              pídelo por WhatsApp en un toque.
            </p>
            <div className="hero-actions">
              <a className="btn btn-lg" href="#tienda">
                Ver catálogo
              </a>
              <a
                className="btn btn-lg btn-ghost"
                href={chat}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                Escribir ahora
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>{active.length}</dt>
                <dd>Productos</dd>
              </div>
              <div>
                <dt>{categoryCount}</dt>
                <dd>Categorías</dd>
              </div>
              <div>
                <dt>18+</dt>
                <dd>Solo mayores</dd>
              </div>
            </dl>
          </div>
          <div className="hero-mark" aria-hidden>
            <div className="mark-glow" />
            <div className="mark-ring" />
            <div className="mark-ring ring-2" />
            <img src="/logo.png" alt="" className="mark-logo" />
          </div>
        </div>
        <a className="scroll-cue" href="#categorias" aria-label="Bajar">
          <span />
        </a>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[0, 1].map((loop) => (
            <span key={loop} className="marquee-group" aria-hidden={loop === 1}>
              {MARQUEE.map((item) => (
                <span key={`${loop}-${item}`} className="marquee-item">
                  {item}
                  <CloudGlyph />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="categorias">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="section-kicker">Lo que encuentras</p>
              <h2 className="display">Elige tu vibe</h2>
            </div>
            <p className="lede">
              Toca una categoría y te llevamos directo a esos productos.
            </p>
          </div>
          <CategoryTiles products={products} />
        </div>
      </section>

      <Products products={products} />

      <section className="section" id="nosotros">
        <div className="wrap split">
          <div data-reveal>
            <p className="section-kicker">La tienda</p>
            <h2 className="display">
              Good vibes, <span className="grad">better days</span>
            </h2>
            <p className="lede">
              Haze Puff es una tienda de vapes en Cofradía, Cortés. Atendemos
              directo por WhatsApp y el catálogo se actualiza desde la tienda.
            </p>
            <div className="features">
              {FEATURES.map((feature) => (
                <article key={feature.title} className="feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
          <a
            className="ig-card"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            data-reveal
          >
            <div className="ig-top">
              <img src="/icon-192.png" alt="" />
              <div>
                <strong>@{INSTAGRAM_HANDLE}</strong>
                <small>Instagram</small>
              </div>
              <span className="ig-icon">
                <InstagramIcon />
              </span>
            </div>
            <div className="ig-visual">
              <img src="/logo.png" alt="Haze Puff" />
            </div>
            <p>Novedades, sabores nuevos y promos primero en Instagram.</p>
            <span className="btn">Seguir @{INSTAGRAM_HANDLE}</span>
          </a>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="section-kicker">Cómo va</p>
              <h2 className="display">Del catálogo al chat</h2>
            </div>
          </div>
          <div className="steps">
            {STEPS.map((step, index) => (
              <article
                key={step.n}
                className="step"
                data-reveal
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="n">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="map-section" id="ubicacion">
        <div className="map-stage">
          <ShopMap />
          <div className="map-card" data-reveal>
            <p className="section-kicker">Ubicación</p>
            <h2 className="display">Cofradía, Cortés</h2>
            <p>
              {SHOP.city}, {SHOP.country}. Escríbenos antes de pasar y te
              damos la indicación exacta.
            </p>
            <div className="map-actions">
              <a className="btn" href={SHOP.mapsUrl} target="_blank" rel="noreferrer">
                Google Maps
              </a>
              <a className="btn btn-ghost" href={SHOP.wazeUrl} target="_blank" rel="noreferrer">
                Waze
              </a>
            </div>
            <a className="map-wa" href={chat} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Pedir indicaciones
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="contacto">
        <div className="wrap contact-grid">
          <div data-reveal>
            <p className="section-kicker">Contacto</p>
            <h2 className="display">Escríbenos</h2>
            <p className="lede">
              El formulario abre WhatsApp con tu mensaje listo para{" "}
              {CONTACT.phoneDisplay}.
            </p>
            <div className="contact-links">
              <a href={CONTACT.phoneHref} target="_blank" rel="noreferrer" className="contact-link">
                <span className="ci ci-wa">
                  <WhatsAppIcon />
                </span>
                <span>
                  <small>WhatsApp</small>
                  {CONTACT.phoneDisplay}
                </span>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="contact-link">
                <span className="ci ci-ig">
                  <InstagramIcon />
                </span>
                <span>
                  <small>Instagram</small>@{INSTAGRAM_HANDLE}
                </span>
              </a>
              <a href={SHOP.mapsUrl} target="_blank" rel="noreferrer" className="contact-link">
                <span className="ci ci-map">
                  <PinGlyph />
                </span>
                <span>
                  <small>Tienda</small>
                  {CONTACT.address}
                </span>
              </a>
            </div>
          </div>
          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap faq-wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="section-kicker">Preguntas</p>
              <h2 className="display">Antes de pasar</h2>
            </div>
          </div>
          <div className="faq" data-reveal>
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
        <div className="wrap" data-reveal>
          <img src="/logo.png" alt="" className="cta-logo" />
          <h2 className="display">¿Ya elegiste?</h2>
          <p>Mándanos el producto por WhatsApp y te confirmamos si está.</p>
          <a className="btn btn-wa btn-lg" href={chat} target="_blank" rel="noreferrer">
            <WhatsAppIcon />
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
        <WhatsAppIcon />
      </a>
    </div>
  );
}

function CloudGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="cloud">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7.1 9.2 4.4 4.4 0 0 0 7 18z"
      />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
      />
    </svg>
  );
}
