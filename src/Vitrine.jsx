import { useState, useEffect } from 'react';
import "./index.css";
import logoImg from "./assets/logo2.jpg";

export default function Vitrine() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
      fetch("http://localhost:5000/produtos")
        .then((res) => res.json())
        .then((data) => {
          setProdutos(data);
          setCarregando(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar", err);
          setCarregando(false);
        });
    }, []);

    if (carregando)
      return <div className="loading">Carregando seus achadinhos...</div>;

    const destaque = produtos.find((p) => p.destaque === true);
    const listaProdutos = produtos.filter((p) => p.destaque !== true);

    return (
      <div className="container">
        <header className="header">
          <img src={logoImg} alt="Achadinhos da Lê" className="logo" />
          <h1 className="title">Achadinhos da Lê</h1>
          <p className="subtitle">
            Garimpos estéticos para transformar sua rotina ✨
          </p>
        </header>

        {destaque && (
          <a
            href={destaque.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-destaque"
          >
            <div className="card-content">
              <img
                src={destaque.imagem}
                alt="Último Vídeo"
                className="img-destaque"
              />
              <div className="info-destaque">
                <span className="nome-destaque">✨ Destaque do último vídeo</span>
                <span className="tag-destaque">{destaque.numero}</span>
                <span className="info-destaque">{destaque.titulo}</span>
              </div>
            </div>
            <span className="seta">↗</span>
          </a>
        )}

        <div className="lista-produtos">
          {listaProdutos.map((prod) => (
            <a
              key={prod.id}
              href={prod.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-produto"
            >
              <div className="card-content">
                <div className="numero-badge">
                  <span className="n-label">nº</span>
                  <span className="n-valor">{prod.numero}</span>
                </div>
                <img
                  src={prod.imagem}
                  alt={prod.titulo}
                  className="img-produto"
                />
                <span className="nome-produto">{prod.titulo}</span>
              </div>
              <span className="seta">↗</span>
            </a>
          ))}
        </div>

        <footer className="footer">
          © 2026 Achadinhos da Lê. Todos os direitos reservados.
        </footer>
      </div>
    );
}
