const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dialog", {
    exibirDialogMensagem: (dados) => ipcRenderer.send('dialog:mensagem:exibir', dados),
    exibirDialogConfirmacao: (dados) => ipcRenderer.invoke('dialog:confirmar:exibir', dados)
})

contextBridge.exposeInMainWorld("lojaMusica", {
    estilo: {
        criar: (descricao) => ipcRenderer.invoke("lojaMusica:estilo:criar", descricao),
        listar: () => ipcRenderer.invoke("lojaMusica:estilo:listar"),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:estilo:excluir", id),
        editar: ({id, descricao}) => ipcRenderer.invoke("lojaMusica:estilo:editar", {id, descricao})
    }
})