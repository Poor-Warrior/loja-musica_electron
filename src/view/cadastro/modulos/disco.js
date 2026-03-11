import { showMessage, showConfirm } from '../shared/utils.js';

export async function loadRecentAlbuns() {
    const tbody = document.querySelector('#table-album tbody');
    if (!tbody) return;
    const result = await window.lojaMusica.disco.listarRecentes();
    if (result.erro) return showMessage('Erro', result.erro);
    tbody.innerHTML = '';
    result.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.disco_id}</td>
            <td>${d.imagem ? `<img src="${d.imagem}" width="50">` : ''}</td>
            <td>${d.nome}</td>
            <td>${d.data_lancamento}</td>
            <td>${d.gravadora_nome || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-album" data-id="${d.disco_id}" data-nome="${d.nome}" data-data="${d.data_lancamento}" data-imagem="${d.imagem}" data-gravadora="${d.gravadora_id}">Editar</button>
                <button class="btn btn-sm btn-danger excluir-album" data-id="${d.disco_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachAlbumActions();
}

function attachAlbumActions() {
    document.querySelectorAll('.excluir-album').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (await showConfirm('Confirmar', 'Excluir este álbum?')) {
                const result = await window.lojaMusica.disco.excluir(id);
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Álbum excluído.');
                    loadRecentAlbuns();
                }
            }
        });
    });

    document.querySelectorAll('.editar-album').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { id, nome, data, imagem, gravadora } = e.target.dataset;
            const form = document.getElementById('form-album');
            form.querySelector('input[name="disco_nome"]').value = nome;
            form.querySelector('input[name="data_lancamento"]').value = data;
            form.querySelector('select[name="gravadora_id"]').value = gravadora;
            // imagem field future implementation
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (event) => {
                event.preventDefault();
                const novoNome = form.querySelector('input[name="disco_nome"]').value.trim();
                const novaData = form.querySelector('input[name="data_lancamento"]').value;
                const novaGravadora = form.querySelector('select[name="gravadora_id"]').value;
                if (!novoNome || !novaData || !novaGravadora) return showMessage('Aviso', 'Preencha todos os campos.');
                const result = await window.lojaMusica.disco.editar({ id, nome: novoNome, data_lancamento: novaData, imagem: '', gravadora_id: novaGravadora });
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Álbum atualizado.');
                    form.reset();
                    form.onsubmit = originalSubmit;
                    loadRecentAlbuns();
                }
            };
        });
    });
}

export function setupAlbumForm() {
    const form = document.getElementById('form-album');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = form.querySelector('input[name="disco_nome"]').value.trim();
        const data = form.querySelector('input[name="data_lancamento"]').value;
        const gravadora = form.querySelector('select[name="gravadora_id"]').value;
        if (!nome || !data || !gravadora) return showMessage('Aviso', 'Preencha todos os campos.');
        // imagem omitted
        const result = await window.lojaMusica.disco.criar({ nome, data_lancamento: data, imagem: '', gravadora_id: gravadora });
        if (result.erro) showMessage('Erro', result.erro);
        else {
            showMessage('Sucesso', 'Álbum criado.');
            form.reset();
            loadRecentAlbuns();
        }
    });
}