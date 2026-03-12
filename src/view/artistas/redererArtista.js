let currentPage = 1;
let currentSearch = '';

async function loadArtistas(page = 1, search = '') {
    const result = await window.lojaMusica.artista.listarPaginado(page, search);
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    const { rows, total } = result;
    const tbody = document.querySelector('#table-artista tbody');
    tbody.innerHTML = '';
    rows.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.artista_id}</td>
            <td>${a.nome}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${a.artista_id}" data-nome="${a.nome}">Editar</button>
                <button class="btn btn-sm btn-danger excluir" data-id="${a.artista_id}">Excluir</button>
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
            loadArtistas(currentPage, currentSearch);
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
                mensagem: 'Excluir este artista?' 
            });
            if (confirmado) {
                const result = await window.lojaMusica.artista.excluir(id);
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Artista excluído.' });
                    loadArtistas(currentPage, currentSearch);
                }
            }
        });
    });

    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nome = e.target.dataset.nome;
            const novoNome = prompt('Editar nome:', nome);
            if (novoNome && novoNome !== nome) {
                window.lojaMusica.artista.editar({ id, nome: novoNome }).then(result => {
                    if (result.erro) {
                        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                    } else {
                        window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Artista atualizado.' });
                        loadArtistas(currentPage, currentSearch);
                    }
                });
            }
        });
    });
}

document.getElementById('btnSearch')?.addEventListener('click', () => {
    currentSearch = document.getElementById('search').value;
    currentPage = 1;
    loadArtistas(currentPage, currentSearch);
});

document.getElementById('search')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('search').value;
        currentPage = 1;
        loadArtistas(currentPage, currentSearch);
    }
});

window.onload = () => loadArtistas();