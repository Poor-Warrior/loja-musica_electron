let currentPage = 1;
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveAlbumEdit');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleAlbumEdit);
    }
    const modalEl = document.getElementById('editAlbumModal');
    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', loadGravadorasForModal);
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

async function loadGravadorasForModal() {
    const select = document.getElementById('editAlbumGravadora');
    const result = await window.lojaMusica.gravadora.listar();
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    select.innerHTML = '<option value="">Selecione...</option>';
    result.forEach(g => {
        const option = document.createElement('option');
        option.value = g.gravadora_id;
        option.textContent = g.nome;
        select.appendChild(option);
    });
}

async function handleAlbumEdit() {
    const id = document.getElementById('editAlbumId').value;
    const nome = document.getElementById('editAlbumNome').value.trim();
    const data = document.getElementById('editAlbumData').value;
    const gravadora_id = document.getElementById('editAlbumGravadora').value;
    if (!nome || !data || !gravadora_id) return;
    const imagem = '';
    const result = await window.lojaMusica.disco.editar({ id, nome, data_lancamento: data, imagem, gravadora_id });
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
    } else {
        window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Álbum atualizado.' });
        bootstrap.Modal.getInstance(document.getElementById('editAlbumModal')).hide();
        loadAlbuns(currentPage, currentSearch);
    }
}

async function loadAlbuns(page = 1, search = '') {
    const result = await window.lojaMusica.disco.listarPaginado(page, search);
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    const { rows, total } = result;
    const tbody = document.querySelector('#table-album tbody');
    tbody.innerHTML = '';
    rows.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.disco_id}</td>
            <td>${d.imagem ? `<img src="${d.imagem}" width="50">` : ''}</td>
            <td>${d.nome}</td>
            <td>${formatDate(d.data_lancamento)}</td>
            <td>${d.gravadora_nome || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${d.disco_id}" data-nome="${d.nome}" data-data="${d.data_lancamento}" data-imagem="${d.imagem}" data-gravadora="${d.gravadora_id}">Editar</button>
                <button class="btn btn-sm btn-danger excluir" data-id="${d.disco_id}">Excluir</button>
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
            loadAlbuns(currentPage, currentSearch);
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
                mensagem: 'Excluir este álbum?' 
            });
            if (confirmado) {
                const result = await window.lojaMusica.disco.excluir(id);
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Álbum excluído.' });
                    loadAlbuns(currentPage, currentSearch);
                }
            }
        });
    });

    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nome = e.target.dataset.nome;
            const data = e.target.dataset.data;
            const gravadora = e.target.dataset.gravadora;
            
            document.getElementById('editAlbumId').value = id;
            document.getElementById('editAlbumNome').value = nome;
            document.getElementById('editAlbumData').value = data;

            const select = document.getElementById('editAlbumGravadora');
            select.value = gravadora;

            const modal = new bootstrap.Modal(document.getElementById('editAlbumModal'));
            modal.show();
        });
    });
}

document.getElementById('btnSearch')?.addEventListener('click', () => {
    currentSearch = document.getElementById('search').value;
    currentPage = 1;
    loadAlbuns(currentPage, currentSearch);
});

document.getElementById('search')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('search').value;
        currentPage = 1;
        loadAlbuns(currentPage, currentSearch);
    }
});

window.onload = () => loadAlbuns();