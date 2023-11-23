const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configuração do banco de dados
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'enzo123',
  database: 'BDEstoqueAula'
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL');
  // Criar a tabela se não existir, vai chamar a próxima função
  createTable();
});

// Função para criar a tabela no banco de dados só se não existir
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      nome VARCHAR(255) NOT NULL,
      descricao VARCHAR(255),
      validade DATE
    )
  `;
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log('Tabela de produtos criada ou já existente');
  });
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    const productList = results.map(product => `
      <li>
        ${product.nome} - ${product.descricao} - ${product.validade}
        <button onclick="editProduct(${product.id})">Editar</button>
        <button onclick="deleteProduct(${product.id})">Excluir</button>
      </li>
    `).join('');
    res.send(`
      <h1>Controle de Estoque</h1>
      <form id="addProductForm" method="POST" action="/addProduct">
        <label for="NomeProduto">Nome do Produto:</label>
        <input type="text" id="NomeProduto" name="NomeProduto" required>

        <label for="DescricaoProduto">Descrição:</label>
        <input type="text" id="DescricaoProduto" name="DescricaoProduto">

        <label for="ValidadeProduto">Validade:</label>
        <input type="date" id="ValidadeProduto" name="ValidadeProduto">

        <button type="submit">Adicionar Produto</button>
      </form>
      <ul>${productList}</ul>
      <script src="script.js"></script>
    `);
  });
});
  

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

function updateProductList(res) {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    const productList = results.map(product => `
      <li>
        ${product.nome} - ${product.descricao} - ${product.validade}
        <button onclick="editProduct(${product.id})">Editar</button>
        <button onclick="deleteProduct(${product.id})">Excluir</button>
      </li>
    `).join('');
    res.send(`
      <h1>Controle de Estoque</h1>
      <form action="/addProduct" method="post">
        <!-- Seus campos do formulário aqui -->
        <button type="submit">Adicionar Produto</button>
      </form>
      <ul>${productList}</ul>
      <script src="script.js"></script>
    `);
  });
}


app.delete('/deleteProduct/:id', (req, res) => {
  const productId = req.params.id;

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao excluir produto do banco de dados.' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/addProduct', (req, res) => {
  const NomeProduto = req.body.NomeProduto;
  const DescricaoProduto = req.body.DescricaoProduto;
  const ValidadeProduto = req.body.ValidadeProduto;

  const sql = 'INSERT INTO products (nome, descricao, validade) VALUES (?, ?, ?)';
  db.query(sql, [NomeProduto, DescricaoProduto, ValidadeProduto], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao adicionar produto ao banco de dados.' });
    } else {

      const productId = result.insertId;
      const addedProduct = { id: productId, nome: NomeProduto, descricao: DescricaoProduto, validade: ValidadeProduto };
      res.json(addedProduct);
    }
  });
});