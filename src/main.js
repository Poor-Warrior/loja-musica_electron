const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

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

    // Funções Estilo
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
}

app.whenReady().then(() => {
    createIpcMain()
    createWindow()
})