let currentPage = 1;
let currentSearch = '';

async function loadGravadoras(page = 1, search = '') {
    const result = await window.lojaMusica.gravadora.listarPaginado(page, search);
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    const { rows, total } = result;
    const tbody = document.querySelector('#table-gravadora tbody');
    tbody.innerHTML = '';
    rows.forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${g.gravadora_id}</td>
            <td>${g.nome}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${g.gravadora_id}" data-nome="${g.nome}">Editar</button>
                <button class="btn btn-sm btn-danger excluir" data-id="${g.gravadora_id}">Excluir</button>
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
            loadGravadoras(currentPage, currentSearch);
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
                mensagem: 'Excluir esta gravadora?' 
            });
            if (confirmado) {
                const result = await window.lojaMusica.gravadora.excluir(id);
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Gravadora excluída.' });
                    loadGravadoras(currentPage, currentSearch);
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
                window.lojaMusica.gravadora.editar({ id, nome: novoNome }).then(result => {
                    if (result.erro) {
                        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                    } else {
                        window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Gravadora atualizada.' });
                        loadGravadoras(currentPage, currentSearch);
                    }
                });
            }
        });
    });
}

document.getElementById('btnSearch')?.addEventListener('click', () => {
    currentSearch = document.getElementById('search').value;
    currentPage = 1;
    loadGravadoras(currentPage, currentSearch);
});

document.getElementById('search')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('search').value;
        currentPage = 1;
        loadGravadoras(currentPage, currentSearch);
    }
});

window.onload = () => loadGravadoras();