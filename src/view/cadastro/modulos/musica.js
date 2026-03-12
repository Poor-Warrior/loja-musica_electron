import {showMessage, showConfirm} from './utils.js';

export async function loadRecentMusicas() {
    const tbody = document.querySelector('#table-musica tbody');
    if (!tbody) return;
    const result = await window.lojaMusica.musica.listarRecentes();
    if (result.erro) return showMessage('Erro', result.erro);
    tbody.innerHTML = '';
    result.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m.musica_id}</td>
            <td>${m.nome}</td>
            <td>${m.duracao}</td>
            <td>${m.data_lancamento}</td>
            <td>${m.estilo_nome || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-musica" data-id="${m.musica_id}" data-nome="${m.nome}" data-duracao="${m.duracao}" data-data="${m.data_lancamento}" data-estilo="${m.estilo_id}">Editar</button>
                <button class="btn btn-sm btn-danger excluir-musica" data-id="${m.musica_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachMusicaActions();
}

function attachMusicaActions() {
    document.querySelectorAll('.excluir-musica').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (await showConfirm('Confirmar', 'Excluir esta música?')) {
                const result = await window.lojaMusica.musica.excluir(id);
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Música excluída.');
                    loadRecentMusicas();
                }
            }
        });
    });

    document.querySelectorAll('.editar-musica').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { id, nome, duracao, data, estilo } = e.target.dataset;
            const form = document.getElementById('form-musica');
            form.querySelector('input[name="musica_nome"]').value = nome;
            form.querySelector('input[name="duracao"]').value = duracao;
            form.querySelector('input[name="musica_lancamento"]').value = data;
            form.querySelector('select[name="estilo_id"]').value = estilo;
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (event) => {
                event.preventDefault();
                const novoNome = form.querySelector('input[name="musica_nome"]').value.trim();
                const novaDuracao = form.querySelector('input[name="duracao"]').value;
                const novaData = form.querySelector('input[name="musica_lancamento"]').value;
                const novoEstilo = form.querySelector('select[name="estilo_id"]').value;
                if (!novoNome || !novaDuracao || !novaData || !novoEstilo) return showMessage('Aviso', 'Preencha todos os campos.');
                const result = await window.lojaMusica.musica.editar({ id, nome: novoNome, duracao: novaDuracao, data_lancamento: novaData, estilo_id: novoEstilo });
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Música atualizada.');
                    form.reset();
                    form.onsubmit = originalSubmit;
                    loadRecentMusicas();
                }
            };
        });
    });
}

export function setupMusicaForm() {
    const form = document.getElementById('form-musica');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = form.querySelector('input[name="musica_nome"]').value.trim();
        const duracao = form.querySelector('input[name="duracao"]').value;
        const data = form.querySelector('input[name="musica_lancamento"]').value;
        const estilo = form.querySelector('select[name="estilo_id"]').value;
        if (!nome || !duracao || !data || !estilo) return showMessage('Aviso', 'Preencha todos os campos.');
        const result = await window.lojaMusica.musica.criar({ nome, duracao, data_lancamento: data, estilo_id: estilo });
        if (result.erro) showMessage('Erro', result.erro);
        else {
            showMessage('Sucesso', 'Música criada.');
            form.reset();
            loadRecentMusicas();
        }
    });
}