const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Função para criar a configuração SQL com base nos parâmetros recebidos
const createSqlConfig = (server, database, user, password, sqlPort) => ({
  user: user,
  password: password,
  server: server,
  database: database,
  port: parseInt(sqlPort, 10), // Adiciona a porta ao config e certifica que é um número
  options: {
    encrypt: false, // Desativa a criptografia
    trustServerCertificate: true, // Aceita certificados autoassinados
    enableArithAbort: true,
  },
});

// Rota para conectar ao banco de dados com os parâmetros fornecidos
app.get('/connect', async (req, res) => {
  const { server, database, user, password, sqlPort } = req.query;
  
  // Adicionar logs para verificar os parâmetros recebidos
  console.log('Parâmetros recebidos:');
  console.log('Servidor:', server);
  console.log('Base de Dados:', database);
  console.log('Usuário:', user);
  console.log('Senha:', password);
  console.log('Porta SQL:', sqlPort);
  
  const sqlConfig = createSqlConfig(server, database, user, password, sqlPort);

  const appPool = new sql.ConnectionPool(sqlConfig);
  try {
    await appPool.connect();
    const result = await appPool.request().query('SELECT 1 AS number');
    console.log('Resultado da consulta:', result.recordset[0].number);
    res.send('Conectado ao banco de dados com sucesso: ' + result.recordset[0].number);
  } catch (err) {
    console.error('Falha na execução da consulta: ', err);
    res.status(500).send('Falha na conexão com o banco de dados: ' + err.message);
  } finally {
    appPool.close();
  }
});

// Middleware para capturar erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado! ' + err.message);
});

const server = app.listen(port, () => {
  console.log(`ouvindo em http://localhost:${port}`);
});
