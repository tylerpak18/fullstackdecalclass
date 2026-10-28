import { Link, NavLink, useLocation } from "react-router";

export default function Navbar() {
  const location = useLocation();

  const onCharactersPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/characters/");

  return (
    <header className="navbar">
      <nav className="navbar-content">
        <Link to="/" className="brand">
          <img
            src="/images/jolly-roger.png"
            alt="Jolly Roger"
            className="brand-logo"
          />
          <span>GRAND LINE</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${onCharactersPage ? "active" : ""}`}
          >
            Characters
          </Link>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Favorites
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
