const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const estiloService = require('./service/Cadastro/estiloService');
const artistaService = require('./service/Cadastro/artistaService');
const gravadoraService = require('./service/Cadastro/gravadoraService');
const musicaService = require('./service/Cadastro/musicaService');
const discoService = require('./service/Cadastro/discoService');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile(path.resolve('src/view/index.html'))
    win.maximize()
    win.show()
}

const createIpcMain = () => {
    
    ipcMain.on('dialog:mensagem:exibir', (event, { titulo, mensagem }) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!focusedWindow) return
    
        dialog.showMessageBox(focusedWindow, {
          type: 'info',
          title: titulo || '',
          message: mensagem || '',
          buttons: ['Ok']
        })
    })

    ipcMain.handle('dialog:confirmar:exibir', async (event, { titulo, mensagem, btnCancelar, btnConfirmar }) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!focusedWindow) return
    
        const { response } = await dialog.showMessageBox(focusedWindow, {
          type: 'question',
          title: titulo || '',
          message: mensagem || '',
          buttons: [
            btnCancelar || 'Cancelar',
            btnConfirmar || 'Confirmar'
          ]
        })
    
        return response === 1
    })

    // Estilo
    ipcMain.handle("lojaMusica:estilo:criar", async (event, descricao) => {
        try {
            return await estiloService.criar(descricao);
        } catch (erro) {
            return {erro: erro.message};
        }
    });

    ipcMain.handle("lojaMusica:estilo:listar", async () => {
        try {
            return await estiloService.listar();
        } catch (erro) {
            return {erro: erro.message};
        }
    });

    ipcMain.handle("lojaMusica:estilo:listarPaginado", async (event, pagina, busca) => {
        try { 
            return await estiloService.listarPaginado(pagina, busca);
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:estilo:excluir", async (event, id) => {
        try {
            return await estiloService.excluir(id);
        } catch {
            return {erro: erro.message};
        }
    });

    ipcMain.handle("lojaMusica:estilo:editar", async (event, dados) => {
        try {
            return await estiloService.editar(dados);
        } catch {
            return {erro: erro.message};
        }
    });

     // Artista
    ipcMain.handle("lojaMusica:artista:criar", async (event, nome) => {
        try { 
            return await artistaService.criar(nome); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:artista:listar", async () => {
        try { 
            return await artistaService.listar(); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:artista:listarPaginado", async (event, pagina, busca) => {
        try { 
            return await artistaService.listarPaginado(pagina, busca); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:artista:excluir", async (event, id) => {
        try { 
            return await artistaService.excluir(id); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:artista:editar", async (event, dados) => {
        try {
            return await artistaService.editar(dados); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    // Gravadora
    ipcMain.handle("lojaMusica:gravadora:criar", async (event, nome) => {
        try { 
            return await gravadoraService.criar(nome); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:gravadora:listar", async () => {
        try { 
            return await gravadoraService.listar(); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:gravadora:listarPaginado", async (event, pagina, busca) => {
        try { 
            return await gravadoraService.listarPaginado(pagina, busca); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:gravadora:excluir", async (event, id) => {
        try { 
            return await gravadoraService.excluir(id); 
        } catch (erro) {
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:gravadora:editar", async (event, dados) => {
        try { 
            return await gravadoraService.editar(dados); 
        } catch (erro) {
            return { erro: erro.message }; 
        }
    });

    // Musica
    ipcMain.handle("lojaMusica:musica:criar", async (event, dados) => {
        try { 
            return await musicaService.criar(dados); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:musica:listarPaginado", async (event, pagina, busca) => {
        try { 
            return await musicaService.listarPaginado(pagina, busca); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:musica:listarRecentes", async () => {
        try {
            return await musicaService.listarRecentes(); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:musica:excluir", async (event, id) => {
        try { 
            return await musicaService.excluir(id); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:musica:editar", async (event, dados) => {
        try { 
            return await musicaService.editar(dados); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    // Disco
    ipcMain.handle("lojaMusica:disco:criar", async (event, dados) => {
        try { 
            return await discoService.criar(dados); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:disco:listarPaginado", async (event, pagina, busca) => {
        try { 
            return await discoService.listarPaginado(pagina, busca); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:disco:listarRecentes", async () => {
        try { 
            return await discoService.listarRecentes(); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:disco:excluir", async (event, id) => {
        try { 
            return await discoService.excluir(id); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });

    ipcMain.handle("lojaMusica:disco:editar", async (event, dados) => {
        try { 
            return await discoService.editar(dados); 
        } catch (erro) { 
            return { erro: erro.message }; 
        }
    });
};

app.whenReady().then(() => {
    createIpcMain()
    createWindow()
})