let currentPage = 1;
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveMusicaEdit');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleMusicaEdit);
    }
    const modalEl = document.getElementById('editMusicaModal');
    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', loadEstilosForModal);
    }
});

function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
    }
    return dateString;
}

async function loadEstilosForModal() {
    const select = document.getElementById('editMusicaEstilo');
    const result = await window.lojaMusica.estilo.listar();
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    select.innerHTML = '<option value="">Selecione...</option>';
    result.forEach(e => {
        const option = document.createElement('option');
        option.value = e.estilo_id;
        option.textContent = e.descricao;
        select.appendChild(option);
    });
}

async function handleMusicaEdit() {
    const id = document.getElementById('editMusicaId').value;
    const nome = document.getElementById('editMusicaNome').value.trim();
    const duracao = document.getElementById('editMusicaDuracao').value;
    const data = document.getElementById('editMusicaData').value;
    const estilo_id = document.getElementById('editMusicaEstilo').value;
    if (!nome || !duracao || !data || !estilo_id) return;

    const result = await window.lojaMusica.musica.editar({ id, nome, duracao, data_lancamento: data, estilo_id });
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
    } else {
        window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Música atualizada.' });
        bootstrap.Modal.getInstance(document.getElementById('editMusicaModal')).hide();
        loadMusicas(currentPage, currentSearch);
    }
}

async function loadMusicas(page = 1, search = '') {
    const result = await window.lojaMusica.musica.listarPaginado(page, search);
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    const { rows, total } = result;
    const tbody = document.querySelector('#table-musica tbody');
    tbody.innerHTML = '';
    rows.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m.musica_id}</td>
            <td>${m.nome}</td>
            <td>${m.duracao}</td>
            <td>${formatDate(m.data_lancamento)}</td>
            <td>${m.estilo_nome || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${m.musica_id}" data-nome="${m.nome}" data-duracao="${m.duracao}" data-data="${m.data_lancamento}" data-estilo="${m.estilo_id}">Editar</button>
                <button class="btn btn-sm btn-danger excluir" data-id="${m.musica_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    renderPagination(total, page);
    attachActions();
}

function renderPagination(total, current) {
    const totalPages = Math.ceil(total / 20);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === current ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            loadMusicas(currentPage, currentSearch);
        });
        pagination.appendChild(li);
    }
}

function attachActions() {
    document.querySelectorAll('.excluir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const confirmado = await window.dialog.exibirDialogConfirmacao({ 
                titulo: 'Confirmar', 
                mensagem: 'Excluir esta música?' 
            });
            if (confirmado) {
                const result = await window.lojaMusica.musica.excluir(id);
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Música excluída.' });
                    loadMusicas(currentPage, currentSearch);
                }
            }
        });
    });

    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nome = e.target.dataset.nome;
            const duracao = e.target.dataset.duracao;
            const data = e.target.dataset.data;
            const estilo = e.target.dataset.estilo;
            
            document.getElementById('editMusicaId').value = id;
            document.getElementById('editMusicaNome').value = nome;
            document.getElementById('editMusicaDuracao').value = duracao;
            document.getElementById('editMusicaData').value = data;
            const select = document.getElementById('editMusicaEstilo');
            select.value = estilo;

            const modal = new bootstrap.Modal(document.getElementById('editMusicaModal'));
            modal.show();
        });
    });
}

document.getElementById('btnSearch')?.addEventListener('click', () => {
    currentSearch = document.getElementById('search').value;
    currentPage = 1;
    loadMusicas(currentPage, currentSearch);
});

document.getElementById('search')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('search').value;
        currentPage = 1;
        loadMusicas(currentPage, currentSearch);
    }
});

window.onload = () => loadMusicas();