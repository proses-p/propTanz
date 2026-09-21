import { ArrowRight, ChevronDown, Compass, Home, MapPin, Menu, Play, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const properties = [
  {
    name: "The Palm House",
    location: "Masaki, Dar es Salaam",
    type: "House",
    price: "TZS 1.8M",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    featured: true,
  },
  {
    name: "Kivukoni Heights",
    location: "Kivukoni, Dar es Salaam",
    type: "Apartment",
    price: "TZS 950K",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "The Courtyard",
    location: "Mikocheni, Dar es Salaam",
    type: "Hostel",
    price: "TZS 420K",
    image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1200&q=85",
  },
];

const categories = [
  { name: "Houses", count: "248 places", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { name: "Apartments", count: "186 places", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80" },
  { name: "Hostels", count: "94 places", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80" },
  { name: "Land", count: "72 places", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" },
  { name: "Buildings", count: "51 places", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80" },
  { name: "Furniture", count: "319 pieces", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80" },
];

const steps = [
  { number: "01", title: "Tell us what feels like home", text: "Search by place, property type, budget, or simply follow your instinct." },
  { number: "02", title: "See the real picture", text: "Browse considered listings with clear details, honest imagery, and local context." },
  { number: "03", title: "Make your next move", text: "Connect directly and take the next step with confidence." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="brand" aria-label="PangaEasy home">
          <span className="brand-mark">P</span>
          <span>Panga<span>Easy</span></span>
        </Link>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#categories" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About us</a>
        </div>
        <div className="nav-actions">
          <Link to="/dashboard" className="nav-login">View properties</Link>
          {/* <Link to="/register" className="nav-cta">List a property <ArrowRight size={16} /></Link> */}
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content page-container">
          <div className="eyebrow light"><Sparkles size={14} /> Find a place with a point of view</div>
          <h1>Where your next<br /><em>chapter</em> takes shape.</h1>
          <p className="hero-copy">PangaEasy brings the places, people, and possibilities of Tanzania together, so finding your next home feels beautifully simple.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#discover">Explore properties <ArrowRight size={18} /></a>
            <a className="button button-ghost" href="#showcase"><span className="play-icon"><Play size={13} fill="currentColor" /></span> See how it works</a>
          </div>
          <div className="hero-trust"><span className="avatar-stack"><i /><i /><i /><i /></span><span><strong>12,000+</strong> people found their place with us</span></div>
        </div>
        <div className="hero-caption"><span>01</span><span className="caption-line" /><span>Dar es Salaam, TZ</span></div>
        <a href="#discover" className="scroll-cue"><span>Scroll to explore</span><ChevronDown size={17} /></a>
      </section>

      <section className="intro-section page-container" id="about">
        <div className="section-kicker">More than a listing</div>
        <div className="intro-grid">
          <h2>A better way to<br /><span>belong somewhere.</span></h2>
          <div><p className="intro-lead">Property search should feel human. PangaEasy is a considered space for discovering homes, spaces, and opportunities that fit the life you are building.</p><a className="text-link" href="#how-it-works">Our approach <ArrowRight size={17} /></a></div>
        </div>
        <div className="stats-row"><div><strong>12k<span>+</span></strong><small>Active seekers</small></div><div><strong>850<span>+</span></strong><small>Verified spaces</small></div><div><strong>18</strong><small>Neighbourhoods</small></div><div><strong>4.9<span>★</span></strong><small>Community rating</small></div></div>
      </section>

      <section className="discover-section" id="discover">
        <div className="page-container">
          <div className="section-heading"><div><div className="section-kicker">A place to start</div><h2>Spaces worth<br /><em>coming home to.</em></h2></div><a href="#categories" className="text-link">View all properties <ArrowRight size={17} /></a></div>
          <div className="property-grid">{properties.map((property) => <article className={`property-card ${property.featured ? "featured" : ""}`} key={property.name}><div className="property-image"><img src={property.image} alt={property.name} loading="lazy" /><span className="property-type">{property.type}</span><button className="save-property" aria-label={`Save ${property.name}`}>♡</button></div><div className="property-info"><div><h3>{property.name}</h3><p><MapPin size={14} /> {property.location}</p></div><div className="property-price"><small>From</small><strong>{property.price}</strong><small>/ month</small></div></div></article>)}</div>
        </div>
      </section>

      <section className="category-section page-container" id="categories">
        <div className="section-heading"><div><div className="section-kicker">Explore by feeling</div><h2>Find your kind<br /><em>of place.</em></h2></div><p className="heading-note">From the first piece of land to the last detail of home, your next move starts here.</p></div>
        <div className="category-grid">{categories.map((category, index) => <a className={`category-card category-${index + 1}`} href="#discover" key={category.name}><img src={category.image} alt={category.name} loading="lazy" /><div className="category-overlay"><span>{category.count}</span><h3>{category.name}</h3><ArrowRight size={19} /></div></a>)}</div>
      </section>

      <section className="search-section"><div className="search-backdrop" /><div className="page-container search-inner"><div className="section-kicker light">The easy way in</div><h2>Start with a place.<br /><em>Find so much more.</em></h2><p>Search the city by neighbourhood, property type, or the feeling you want to come home to.</p><div className="search-box"><div className="search-field"><Search size={19} /><div><span>I'm looking for</span><strong>A modern apartment</strong></div></div><div className="search-field"><MapPin size={19} /><div><span>In</span><strong>Dar es Salaam, Tanzania</strong></div></div><button className="search-button" aria-label="Search properties"><ArrowRight size={22} /></button></div><div className="popular-searches"><span>Popular searches</span><a href="#discover">Apartments in Masaki</a><a href="#discover">Hostels near UDSM</a><a href="#discover">Land in Kigamboni</a></div></div></section>

      <section className="why-section page-container"><div className="why-visual"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" alt="Sunlit modern living room" loading="lazy" /><div className="image-stamp"><ShieldCheck size={18} /><span>Every listing<br /><strong>worth your time.</strong></span></div></div><div className="why-copy"><div className="section-kicker">Why PangaEasy</div><h2>Good places<br /><em>feel different.</em></h2><p>We are making property more personal, more transparent, and a little more inspiring. Because a place is never just a place.</p><ul><li><span><ShieldCheck size={19} /></span><div><strong>Trust, built in</strong><small>Clear listings and verified details help you move with confidence.</small></div></li><li><span><Compass size={19} /></span><div><strong>Local perspective</strong><small>Discover the neighbourhoods and stories behind every address.</small></div></li><li><span><Users size={19} /></span><div><strong>People first</strong><small>A direct, human way to connect with the people behind each space.</small></div></li></ul></div></section>

      <section className="showcase-section page-container" id="showcase"><div className="section-heading"><div><div className="section-kicker">A glimpse inside</div><h2>Details that make<br /><em>a place yours.</em></h2></div><a href="#discover" className="text-link">Browse the collection <ArrowRight size={17} /></a></div><div className="showcase-grid"><img className="showcase-large" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Designer living room" loading="lazy" /><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85" alt="Warm modern kitchen" loading="lazy" /><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85" alt="Calm bedroom interior" loading="lazy" /><div className="showcase-note"><span>“</span><p>A home should hold the life you have now, and leave room for the life still coming.</p><small>— The PangaEasy journal</small></div></div></section>

      <section className="steps-section" id="how-it-works"><div className="page-container"><div className="steps-header"><div><div className="section-kicker">Simple by design</div><h2>Your next place,<br /><em>in three easy moves.</em></h2></div><p>Less noise. More clarity. A considered way to find the place that is already waiting for you.</p></div><div className="steps-grid">{steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><div className="step-icon"><Home size={22} /></div><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></div></section>

      <section className="cta-section page-container"><div className="cta-panel"><div className="cta-copy"><div className="section-kicker">Your story starts here</div><h2>Make room for<br /><em>what's next.</em></h2><p>Whether you are looking for a first key, a fresh start, or a space to grow into, PangaEasy is ready when you are.</p><Link to="/register" className="button button-dark">Start exploring <ArrowRight size={18} /></Link></div><div className="cta-image"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" alt="Bright contemporary home" loading="lazy" /></div></div></section>

      <footer className="landing-footer"><div className="page-container footer-top"><div><Link to="/" className="brand brand-footer"><span className="brand-mark">P</span><span>Panga<span>Easy</span></span></Link><p>A more human way to<br />find your place.</p></div><div className="footer-links"><div><span>Explore</span><a href="#discover">Properties</a><a href="#categories">Collections</a><a href="#showcase">Journal</a></div><div><span>Company</span><a href="#about">About us</a><a href="#how-it-works">How it works</a><a href="#about">Contact</a></div><div><span>Follow along</span><a href="#about">Instagram</a><a href="#about">LinkedIn</a><a href="#about">Pinterest</a></div></div></div><div className="page-container footer-bottom"><span>© 2026 PangaEasy. All rights reserved.</span><span>Made for the places we call home.</span></div></footer>
    </main>
  );
}