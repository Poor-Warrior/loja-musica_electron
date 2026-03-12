let currentPage = 1;
let currentSearch = '';

async function loadEstilos(page = 1, search = '') {
    const result = await window.lojaMusica.estilo.listarPaginado(page, search);
    if (result.erro) {
        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
        return;
    }
    const { rows, total } = result;
    const tbody = document.querySelector('#table-estilo tbody');
    tbody.innerHTML = '';
    rows.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.estilo_id}</td>
            <td>${e.descricao}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${e.estilo_id}" data-descricao="${e.descricao}">Editar</button>
                <button class="btn btn-sm btn-danger excluir" data-id="${e.estilo_id}">Excluir</button>
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
            loadEstilos(currentPage, currentSearch);
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
                mensagem: 'Excluir este estilo?' 
            });
            if (confirmado) {
                const result = await window.lojaMusica.estilo.excluir(id);
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Estilo excluído.' });
                    loadEstilos(currentPage, currentSearch);
                }
            }
        });
    });

    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const descricao = e.target.dataset.descricao;
            const novaDesc = prompt('Editar descrição:', descricao);
            if (novaDesc && novaDesc !== descricao) {
                window.lojaMusica.estilo.editar({ id, descricao: novaDesc }).then(result => {
                    if (result.erro) {
                        window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                    } else {
                        window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Estilo atualizado.' });
                        loadEstilos(currentPage, currentSearch);
                    }
                });
            }
        });
    });
}

document.getElementById('btnSearch')?.addEventListener('click', () => {
    currentSearch = document.getElementById('search').value;
    currentPage = 1;
    loadEstilos(currentPage, currentSearch);
});

document.getElementById('search')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('search').value;
        currentPage = 1;
        loadEstilos(currentPage, currentSearch);
    }
});

window.onload = () => loadEstilos();