import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kaue2004",
  database: "easyhospital",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

// Endpoint para listar as consultas
app.get("/api/consultas", (req, res) => {
  db.query("SELECT * FROM consultas", (err, results) => {
    if (err) {
      console.error("Erro ao consultar as consultas:", err);
      res.status(500).json({ message: "Erro ao consultar as consultas" });
      return;
    }
    res.json(results);
  });
});

// Endpoint para listar os convenios
app.get("/api/convenios", (req, res) => {
  db.query("SELECT * FROM convenios", (err, results) => {
    if (err) {
      console.error("Erro ao consultar os convenios:", err);
      res.status(500).json({ message: "Erro ao consultar os convenios" });
      return;
    }
    res.json(results);
  });
});

// Endpoint para cadastrar um novo paciente
app.post("/api/pacientes", (req, res) => {
  const { nome, cpf, idade, telefone, celular, convenio_id } = req.body;

  if (!nome || !cpf || !idade || !telefone || !celular || !convenio_id) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const query = `
    INSERT INTO paciente (cpf, nome, idade, telefone, celular, convenio_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [cpf, nome, idade, telefone, celular, convenio_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao salvar o paciente:", err);
      return res.status(500).json({ message: "Erro ao salvar o paciente." });
    }
    res.status(201).json({ message: "Paciente cadastrado com sucesso!", id: result.insertId });
  });
});

// Endpoint para listar os pacientes
app.get("/api/pacientes", (req, res) => {
  const query = "SELECT * FROM paciente";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao consultar os pacientes:", err);
      return res.status(500).json({ message: "Erro ao consultar os pacientes" });
    }
    res.json(results);
  });
});

// Endpoint para listar as especialidades
app.get("/api/especialidades", (req, res) => {
  const query = `
    SELECT e.id, e.descricao, e.convenios_id, c.nome as convenio_nome
    FROM especialidades e
    JOIN convenios c ON e.convenios_id = c.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao consultar as especialidades:", err);
      return res.status(500).json({ message: "Erro ao consultar as especialidades" });
    }
    res.json(results);
  });
});

// Endpoint para cadastrar um novo médico
app.post("/api/medicos", (req, res) => {
  const { nome, crm, telefone, celular, especialidade_id, sexo, usuario, senha } = req.body;

  if (!nome || !crm || !telefone || !celular || !especialidade_id || !sexo || !usuario || !senha) {
    return res.status(400).json({ message: "Por favor, preencha todos os campos obrigatórios." });
  }

  const query = `
    INSERT INTO medico (nome, crm, telefone, celular, especialidade_id, sexo, usuario, senha) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [nome, crm, telefone, celular, especialidade_id, sexo, usuario, senha];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir o médico:", err);
      return res.status(500).json({ message: "Erro ao cadastrar o médico" });
    }
    res.status(201).json({ message: "Médico cadastrado com sucesso", medicoId: result.insertId });
  });
});

// Endpoint para listar os médicos
app.get("/api/medicos", (req, res) => {
  const query = `SELECT * FROM medico`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os médicos:", err);
      return res.status(500).json({ message: "Erro ao listar os médicos" });
    }
    res.status(200).json(results);
  });
});

// Endpoint para salvar uma consulta
app.post("/api/consultas", (req, res) => {
  const { paciente_id, medico_id, data_hora, descricao } = req.body;

  if (!paciente_id || !medico_id || !data_hora || !descricao) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const query = `
    INSERT INTO consultas (paciente_id, medico_id, data_hora, descricao)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [paciente_id, medico_id, data_hora, descricao], (err, result) => {
    if (err) {
      console.error("Erro ao salvar a consulta:", err);
      return res.status(500).json({ message: "Erro ao agendar a consulta" });
    }
    res.status(201).json({ message: "Consulta agendada com sucesso!", consultaId: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
