export async function showMessage(titulo, mensagem) {
    window.dialog.exibirDialogMensagem({ titulo, mensagem });
}

export async function showConfirm(titulo, mensagem) {
    return await window.dialog.exibirDialogConfirmacao({ titulo, mensagem });
}

export function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
    }
    return dateString;
}