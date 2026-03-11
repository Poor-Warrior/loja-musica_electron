const db = require('../../../database/connections');

const criar = ({ nome, duracao, data_lancamento, estilo_id }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO musica (nome, duracao, data_lancamento, estilo_id) VALUES (?, ?, ?, ?)`,
            [nome, duracao, data_lancamento, estilo_id],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, nome, duracao, data_lancamento, estilo_id });
            }
        );
    });
};

const listarPaginado = (pagina = 1, busca = '') => {
    const limite = 20;
    const offset = (pagina - 1) * limite;
    let query = `SELECT m.*, e.descricao as estilo_nome FROM musica m LEFT JOIN estilo e ON m.estilo_id = e.estilo_id`;
    let countQuery = `SELECT COUNT(*) as total FROM musica m`;
    let params = [];
    if (busca) {
        query += ` WHERE m.nome LIKE ?`;
        countQuery += ` WHERE m.nome LIKE ?`;
        params.push(`%${busca}%`);
    }
    query += ` ORDER BY m.data_lancamento DESC LIMIT ? OFFSET ?`;
    const queryParams = [...params, limite, offset];
    const countParams = [...params];
    return new Promise((resolve, reject) => {
        db.all(query, queryParams, (err, rows) => {
            if (err) reject(err);
            else {
                db.get(countQuery, countParams, (err, countRow) => {
                    if (err) reject(err);
                    else resolve({ rows, total: countRow.total });
                });
            }
        });
    });
};

const listarRecentes = () => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT m.*, e.descricao as estilo_nome FROM musica m LEFT JOIN estilo e ON m.estilo_id = e.estilo_id ORDER BY m.data_lancamento DESC LIMIT 10`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

const excluir = (id) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM musica WHERE musica_id = ?`, [id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

const editar = ({ id, nome, duracao, data_lancamento, estilo_id }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE musica SET nome = ?, duracao = ?, data_lancamento = ?, estilo_id = ? WHERE musica_id = ?`,
            [nome, duracao, data_lancamento, estilo_id, id],
            function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};

module.exports = { 
    criar, 
    listarPaginado, 
    listarRecentes, 
    excluir, 
    editar 
};