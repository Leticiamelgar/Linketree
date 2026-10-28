require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// O Porteiro: Verifica se a senha enviada pelo React é igual à do .env
const verificarSenha = (req, res, next) => {
  const senhaRecebida = req.headers['x-senha-admin'];
  if (senhaRecebida !== process.env.SENHA_ADMIN) {
    return res.status(401).json({ error: 'Acesso negado: Senha incorreta' });
  }
  next(); // Senha correta, a requisição pode prosseguir
};

// 1. ROTA PÚBLICA: Buscar todos os produtos (Usada pela Vitrine e pelo Admin)
app.get('/produtos', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. ROTA PROTEGIDA: Criar novo produto
app.post('/produtos', verificarSenha, async (req, res) => {
  const { numero, titulo, link, imagem, destaque } = req.body;
  
  // Se este for destaque, remove o destaque automático do anterior
  if (destaque) {
    await supabase.from('produtos').update({ destaque: false }).eq('destaque', true);
  }
  
  const { data, error } = await supabase.from('produtos').insert([{ numero, titulo, link, imagem, destaque }]);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. ROTA PROTEGIDA: Atualizar produto existente
app.put('/produtos/:id', verificarSenha, async (req, res) => {
  const { id } = req.params;
  const { numero, titulo, link, imagem, destaque } = req.body;
  
  if (destaque) {
    await supabase.from('produtos').update({ destaque: false }).eq('destaque', true);
  }
  
  const { data, error } = await supabase.from('produtos').update({ numero, titulo, link, imagem, destaque }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensagem: 'Atualizado com sucesso' });
});

// 4. ROTA PROTEGIDA: Apagar produto
app.delete('/produtos/:id', verificarSenha, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('produtos').delete().eq('id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensagem: 'Apagado com sucesso' });
});

// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor a rodar na porta 5000');
});