const db = require('../../../database/connection')

const criar = (descricao) => {
    console.log('>>> lojaMusica:estilo:criar > ', descricao)

    db.run(`INSERT INTO estilo (descricao) VALUES (?);`, [descricao]);
}

const listar = () => {
    console.log('>>> lojaMusica:estilo:listar > ')

    return new Promise((resolve, reject) => {

        db.all(`SELECT * FROM estilo;`, (erro, resposta) => {
            // função de callback
            console.log(resposta)
            resolve(resposta)
        });

    });
}

const excluir = (id) => {
    console.log('>>> lojaMusica:estilo:excluir > ', id)

    db.run(`DELETE FROM estilo WHERE estilo_id = (?);`, [id]);
}

const editar = ({ id, descricao }) => {
    console.log('>>> lojaMusica:estilo:editar > ', id, descricao)

    db.run(`UPDATE estilo SET descricao = (?) WHERE estilo_id = (?);`, [descricao, id]);
}

module.exports = {
    criar,
    listar,
    excluir,
    editar
}