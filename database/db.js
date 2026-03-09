const db = require('./connetions');

db.run(`
    CREATE TABLE IF NOT EXISTS artista (
        artista_id INTERGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS estilo (
        estilo_id INTERGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(255) NOT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS gravadora (
        gravadora_id INTERGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL
    ); 
`);

db.run(`
    CREATE TABLE IF NOT EXISTS musica (
        musica_id INTERGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL,
        duracao VARCHAR(255) NOT NULL,
        data_lancamento DATE NOT NULL,
        estilo_id INTERGER NOT NULL,
        
        -- regra de chave estrangeira
        FOREIGN KEY (estilo_id) REFERENCES estilo (estilo_id)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS disco (
        disco_id INTERGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL,
        data_lancamento DATE NOT NULL,
        imagem TEXT,
        gravadora_id INTERGER,
        
        -- regra de chave estrangeira
        FOREIGN KEY (gravadora_id) REFERENCES gravadora (gravadora_id)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS musica_disco (
        musica_id INTERGER NOT NULL,
        disco_id INTERGER NOT NULL,
        
        -- regra de chave estrangeira
        FOREIGN KEY (musica_id) REFERENCES musica (musica_id),
        FOREIGN KEY (disco_id) REFERENCES disco (disco_id),
        
        -- regra de chave primaria composta
        PRIMARY KEY (musica_id, disco_id)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS compositor (
        musica_id INTERGER NOT NULL,
        artista_id INTERGER NOT NULL,
        
        -- regra de chave estrangeira
        FOREIGN KEY (musica_id) REFERENCES musica (musica_id),
        FOREIGN KEY (artista_id) REFERENCES artista (artista_id),
        
        -- regra de chave primaria composta
        PRIMARY KEY (musica_id, artista_id)
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS interprete (
        musica_id INTERGER NOT NULL,
        artista_id INTERGER NOT NULL,
        
        -- regra de chave estrangeira
        FOREIGN KEY (musica_id) REFERENCES musica (musica_id),
        FOREIGN KEY (artista_id) REFERENCES artista (artista_id),
        
        -- regra de chave primaria composta
        PRIMARY KEY (musica_id, artista_id)
    );
`);