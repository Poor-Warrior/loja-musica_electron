const db = require('../../../database/connections');

const criar = (descricao) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO estilo (descricao) VALUES (?)`, [descricao], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, descricao });
        });
    });
};

const listar = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM estilo`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const listarPaginado = (pagina = 1, busca = '') => {
    const limite = 20;
    const offset = (pagina - 1) * limite;
    let query = `SELECT * FROM estilo`;
    let countQuery = `SELECT COUNT(*) as total FROM estilo`;
    let params = [];
    if (busca) {
        query += ` WHERE descricao LIKE ?`;
        countQuery += ` WHERE descricao LIKE ?`;
        params.push(`%${busca}%`);
    }
    query += ` ORDER BY estilo_id ASC LIMIT ? OFFSET ?`;
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
        db.run(`DELETE FROM estilo WHERE estilo_id = ?`, [id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

const editar = ({ id, descricao }) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE estilo SET descricao = ? WHERE estilo_id = ?`, [descricao, id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};

module.exports = { 
    criar,
    listar, 
    listarPaginado, 
    excluir, 
    editar 
};
