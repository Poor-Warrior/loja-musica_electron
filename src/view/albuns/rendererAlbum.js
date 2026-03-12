let currentPage = 1;
let currentSearch = '';

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
            <td>${d.data_lancamento}</td>
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
            const imagem = e.target.dataset.imagem;
            const novoNome = prompt('Editar nome do álbum:', nome);
            if (!novoNome) return;
            const novaData = prompt('Editar data (YYYY-MM-DD):', data);
            if (!novaData) return;
            const novaGravadora = prompt('Editar ID da gravadora:', gravadora);
            if (!novaGravadora) return;
            // imagem not handled in prompt
            window.lojaMusica.disco.editar({ 
                id, 
                nome: novoNome, 
                data_lancamento: novaData, 
                imagem: imagem, 
                gravadora_id: novaGravadora 
            }).then(result => {
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Álbum atualizado.' });
                    loadAlbuns(currentPage, currentSearch);
                }
            });
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