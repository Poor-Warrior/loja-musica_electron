let currentPage = 1;
let currentSearch = '';

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
            <td>${m.data_lancamento}</td>
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
            const novoNome = prompt('Editar nome:', nome);
            if (!novoNome) return;
            const novaDuracao = prompt('Editar duração (HH:MM):', duracao);
            if (!novaDuracao) return;
            const novaData = prompt('Editar data (YYYY-MM-DD):', data);
            if (!novaData) return;
            const novoEstilo = prompt('Editar ID do estilo:', estilo);
            if (!novoEstilo) return;
            
            window.lojaMusica.musica.editar({ 
                id, 
                nome: novoNome, 
                duracao: novaDuracao, 
                data_lancamento: novaData, 
                estilo_id: novoEstilo 
            }).then(result => {
                if (result.erro) {
                    window.dialog.exibirDialogMensagem({ titulo: 'Erro', mensagem: result.erro });
                } else {
                    window.dialog.exibirDialogMensagem({ titulo: 'Sucesso', mensagem: 'Música atualizada.' });
                    loadMusicas(currentPage, currentSearch);
                }
            });
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