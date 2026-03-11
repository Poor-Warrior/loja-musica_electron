export async function showMessage(titulo, mensagem) {
    window.dialog.exibirDialogMensagem({ titulo, mensagem });
}
export async function showConfirm(titulo, mensagem) {
    return await window.dialog.exibirDialogConfirmacao({ titulo, mensagem });
}