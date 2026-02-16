import "../styles/layout.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>ALTAR STUDIO</h3>
        <p>Arte regional huasteco que preserva nuestra cultura.</p>

        <div className="footer-links">
          <a href="#">Políticas</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </div>

        <p className="copyright">
          © 2026 Altar Studio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
