const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dialog", {
    exibirDialogMensagem: (dados) => ipcRenderer.send('dialog:mensagem:exibir', dados),
    exibirDialogConfirmacao: (dados) => ipcRenderer.invoke('dialog:confirmar:exibir', dados)
});

contextBridge.exposeInMainWorld("lojaMusica", {
    estilo: {
        criar: (descricao) => ipcRenderer.invoke("lojaMusica:estilo:criar", descricao),
        listar: () => ipcRenderer.invoke("lojaMusica:estilo:listar"),
        listarPaginado: (pagina, busca) => ipcRenderer.invoke("lojaMusica:estilo:listarPaginado", pagina, busca),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:estilo:excluir", id),
        editar: ({id, descricao}) => ipcRenderer.invoke("lojaMusica:estilo:editar", {id, descricao})
    },
    artista: {
        criar: (nome) => ipcRenderer.invoke("lojaMusica:artista:criar", nome),
        listar: () => ipcRenderer.invoke("lojaMusica:artista:listar"),
        listarPaginado: (pagina, busca) => ipcRenderer.invoke("lojaMusica:artista:listarPaginado", pagina, busca),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:artista:excluir", id),
        editar: ({id, nome}) => ipcRenderer.invoke("lojaMusica:artista:editar", {id, nome})
    },
    gravadora: {
        criar: (nome) => ipcRenderer.invoke("lojaMusica:gravadora:criar", nome),
        listar: () => ipcRenderer.invoke("lojaMusica:gravadora:listar"),
        listarPaginado: (pagina, busca) => ipcRenderer.invoke("lojaMusica:gravadora:listarPaginado", pagina, busca),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:gravadora:excluir", id),
        editar: ({id, nome}) => ipcRenderer.invoke("lojaMusica:gravadora:editar", {id, nome})
    },
    musica: {
        criar: (dados) => ipcRenderer.invoke("lojaMusica:musica:criar", dados),
        listarPaginado: (pagina, busca) => ipcRenderer.invoke("lojaMusica:musica:listarPaginado", pagina, busca),
        listarRecentes: () => ipcRenderer.invoke("lojaMusica:musica:listarRecentes"),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:musica:excluir", id),
        editar: (dados) => ipcRenderer.invoke("lojaMusica:musica:editar", dados)
    },
    disco: {
        criar: (dados) => ipcRenderer.invoke("lojaMusica:disco:criar", dados),
        listarPaginado: (pagina, busca) => ipcRenderer.invoke("lojaMusica:disco:listarPaginado", pagina, busca),
        listarRecentes: () => ipcRenderer.invoke("lojaMusica:disco:listarRecentes"),
        excluir: (id) => ipcRenderer.invoke("lojaMusica:disco:excluir", id),
        editar: (dados) => ipcRenderer.invoke("lojaMusica:disco:editar", dados)
    }
});