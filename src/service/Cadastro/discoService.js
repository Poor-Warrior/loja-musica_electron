const db = require('../../../database/connections');

const criar = ({ nome, data_lancamento, imagem, gravadora_id }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO disco (nome, data_lancamento, imagem, gravadora_id) VALUES (?, ?, ?, ?)`,
            [nome, data_lancamento, imagem, gravadora_id],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, nome, data_lancamento, imagem, gravadora_id });
            }
        );
    });
};

const listarPaginado = (pagina = 1, busca = '') => {
    const limite = 20;
    const offset = (pagina - 1) * limite;
    let query = `SELECT d.*, g.nome as gravadora_nome FROM disco d LEFT JOIN gravadora g ON d.gravadora_id = g.gravadora_id`;
    let countQuery = `SELECT COUNT(*) as total FROM disco d`;
    let params = [];
    if (busca) {
        query += ` WHERE d.nome LIKE ?`;
        countQuery += ` WHERE d.nome LIKE ?`;
        params.push(`%${busca}%`);
    }
    query += ` ORDER BY d.data_lancamento DESC LIMIT ? OFFSET ?`;
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
            `SELECT d.*, g.nome as gravadora_nome FROM disco d LEFT JOIN gravadora g ON d.gravadora_id = g.gravadora_id ORDER BY d.data_lancamento DESC LIMIT 10`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

const excluir = (id) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM disco WHERE disco_id = ?`, [id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

const editar = ({ id, nome, data_lancamento, imagem, gravadora_id }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE disco SET nome = ?, data_lancamento = ?, imagem = ?, gravadora_id = ? WHERE disco_id = ?`,
            [nome, data_lancamento, imagem, gravadora_id, id],
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