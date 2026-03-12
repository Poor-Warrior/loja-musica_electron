const db = require('../../../database/connections');

const criar = (nome) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO artista (nome) VALUES (?)`, [nome], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, nome });
        });
    });
};

const listar = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM artista`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const listarPaginado = (pagina = 1, busca = '') => {
    const limite = 20;
    const offset = (pagina - 1) * limite;
    let query = `SELECT * FROM artista`;
    let countQuery = `SELECT COUNT(*) as total FROM artista`;
    let params = [];
    if (busca) {
        query += ` WHERE nome LIKE ?`;
        countQuery += ` WHERE nome LIKE ?`;
        params.push(`%${busca}%`);
    }
    query += ` ORDER BY artista_id ASC LIMIT ? OFFSET ?`;
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

const excluir = (id) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM artista WHERE artista_id = ?`, [id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

const editar = ({ id, nome }) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE artista SET nome = ? WHERE artista_id = ?`, [nome, id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

module.exports = { criar, 
    listar, 
    listarPaginado, 
    excluir, 
    editar 
};