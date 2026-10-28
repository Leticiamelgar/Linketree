import { useState, useEffect } from 'react';
import "./index.css";

export default function Admin() {
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ numero: '', titulo: '', link: '', imagem: '', destaque: false });
  const [editId, setEditId] = useState(null);

  const carregarDados = async () => {
    const res = await fetch('https://linketree-ddba.onrender.com/produtos');
    const data = await res.json();
    setProdutos(data);

    if (data.length > 0) {
      const maiorNumero = Math.max(...data.map(p => Number(p.numero) || 0));
      const proximoNumero = String(maiorNumero + 1).padStart(2, '0');
      setForm(f => ({ ...f, numero: proximoNumero }));
    } else {
      setForm(f => ({ ...f, numero: '01' }));
    }
  };

  useEffect(() => { 
    if (autenticado) carregarDados(); 
  }, [autenticado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `https://linketree-ddba.onrender.com/produtos/${editId}` : 'https://linketree-ddba.onrender.com/produtos';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-senha-admin': senha // A palavra-passe vai escondida aqui
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) return alert('Erro: Palavra-passe incorreta ou falha no servidor.');
    
    alert(editId ? 'Achadinho atualizado!' : 'Achadinho salvo!');
    setForm({ numero: '', titulo: '', link: '', imagem: '', destaque: false });
    setEditId(null);
    carregarDados();
  };

  const editarItem = (prod) => {
    setEditId(prod.id);
    setForm({ numero: prod.numero, titulo: prod.titulo, link: prod.link, imagem: prod.imagem, destaque: prod.destaque });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const apagarItem = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar?')) {
      const res = await fetch(`https://linketree-ddba.onrender.com/produtos/${id}`, { 
        method: 'DELETE',
        headers: { 'x-senha-admin': senha } // A palavra-passe protege a exclusão
      });
      if (res.ok) carregarDados();
      else alert('Erro: Acesso negado.');
    }
  };

  if (!autenticado) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); setAutenticado(true); }} style={{ background: '#fff', padding: '30px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#333', textAlign: 'center' }}>🔒 Acesso Restrito</h2>
          <input type="password" placeholder="Palavra-passe" value={senha} onChange={e => setSenha(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ padding: '14px', background: '#8c7355', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar no Painel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: 'auto', paddingBottom: '40px', paddingTop: '20px' }}>
      {/* O resto do HTML do Admin (Formulário e Lista) continua exatamente igual ao anterior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333' }}>{editId ? '✏️ Editar Achadinho' : '✨ Novo Achadinho'}</h2>
        <button onClick={() => setAutenticado(false)} style={{ padding: '8px 12px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>Sair</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#fff', padding: '25px', borderRadius: '15px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <input placeholder="Número (ex: 04)" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input placeholder="Título do Produto" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input placeholder="Link de Afiliado" value={form.link} onChange={e => setForm({...form, link: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input placeholder="Link da Imagem ou /foto.jpg" value={form.imagem} onChange={e => setForm({...form, imagem: e.target.value})} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
          <input type="checkbox" checked={form.destaque} onChange={e => setForm({...form, destaque: e.target.checked})} style={{ width: '18px', height: '18px' }} />
          É o Último Vídeo (Destaque)?
        </label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '14px', background: '#8c7355', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editId ? 'Salvar Alterações' : 'Cadastrar'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); carregarDados(); }} style={{ padding: '14px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>}
        </div>
      </form>

      <h3 style={{ marginBottom: '15px', color: '#333' }}>Seus Achadinhos ({produtos.length})</h3>
      <div className="lista-produtos">
        {produtos.map(prod => (
          <div key={prod.id} className={prod.destaque ? "card-destaque" : "card-produto"} style={{ cursor: 'default', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-content">
              {prod.destaque ? (
                <><img src={prod.imagem} alt="Destaque" className="img-destaque" /><div className="info-destaque"><span className="tag-destaque">{prod.numero}</span><span className="nome-destaque">{prod.titulo}</span></div></>
              ) : (
                <><div className="numero-badge"><span className="n-label">nº</span><span className="n-valor">{prod.numero}</span></div><img src={prod.imagem} alt={prod.titulo} className="img-produto" /><span className="nome-produto">{prod.titulo}</span></>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingRight: '15px' }}>
              <button onClick={() => editarItem(prod)} style={{ padding: '8px 12px', background: '#e2d5c5', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
              <button onClick={() => apagarItem(prod.id)} style={{ padding: '8px 12px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Apagar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}