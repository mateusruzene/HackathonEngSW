/**
 * Cliente Web Interativo - Sistema de Gestão de Hackathons Acadêmicos (DInf - UFPR)
 * Trabalho Prático 1 - Engenharia de Software 2026/1
 * Alunos: Mateus Siqueira Ruzene (GRR20221223) e Gabriel Claudino de Souza (GRR20215730)
 */

document.addEventListener('DOMContentLoaded', () => {
  let activeHackathonId = null;

  // Tab navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Seed Button
  document.getElementById('btn-seed').addEventListener('click', async () => {
    try {
      showToast('Carregando dados de demonstração da UFPR...');
      const res = await fetch('/api/seed', { method: 'POST', body: '{}' });
      const data = await res.json();
      if (data.success) {
        showToast('Dados de demonstração carregados com sucesso!', 'success');
        activeHackathonId = data.hackathon_id;
        await refreshDashboard();
      }
    } catch (e) {
      showToast('Erro ao carregar dados: ' + e.message, 'error');
    }
  });

  // Refresh Ranking Button
  document.getElementById('btn-refresh-ranking').addEventListener('click', refreshDashboard);

  // Forms submit handlers
  setupForms();

  // Initial load
  refreshDashboard();

  async function refreshDashboard() {
    try {
      const url = activeHackathonId ? `/api/hackathon/relatorio?id=${activeHackathonId}` : '/api/hackathon/relatorio';
      const res = await fetch(url);
      if (!res.ok) {
        // Tenta semear se vazio
        await fetch('/api/seed', { method: 'POST', body: '{}' });
        const retryRes = await fetch('/api/hackathon/relatorio');
        if (!retryRes.ok) return;
        const retryData = await retryRes.json();
        renderDashboard(retryData);
        return;
      }
      const data = await res.json();
      renderDashboard(data);
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
    }
  }

  function renderDashboard(data) {
    const h = data.hackathon;
    const m = data.metricas;
    activeHackathonId = h.id;

    // Stats
    document.getElementById('stat-hack-name').textContent = h.nome;
    document.getElementById('stat-teams-count').textContent = `${m.total_equipes} / ${h.max_equipes}`;
    document.getElementById('stat-projects-count').textContent = `${m.total_projetos} (${m.total_participantes} alunos)`;
    document.getElementById('stat-evals-count').textContent = `${m.total_mentorias} ment. / ${m.total_avaliacoes} aval.`;

    // Ranking Table & Podium
    renderRanking(data.ranking);

    // Teams list
    renderTeams(data.equipes);

    // Populate selects in forms
    populateSelects(data);
  }

  function renderRanking(ranking) {
    const tbody = document.getElementById('ranking-tbody');
    const podium = document.getElementById('podium-container');

    if (!ranking || ranking.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum projeto classificado ainda.</td></tr>`;
      podium.innerHTML = '';
      return;
    }

    // Render Table
    tbody.innerHTML = ranking.map(item => {
      const medal = item.posicao === 1 ? '🥇 1º' : (item.posicao === 2 ? '🥈 2º' : (item.posicao === 3 ? '🥉 3º' : `${item.posicao}º`));
      return `
        <tr>
          <td><strong>${medal}</strong></td>
          <td><strong>${escapeHtml(item.titulo_projeto)}</strong></td>
          <td>${escapeHtml(item.nome_equipe)}</td>
          <td><span class="badge">${escapeHtml(item.area_tematica)}</span></td>
          <td>${item.total_avaliacoes} avaliações</td>
          <td><span class="score-tag">${item.nota_media.toFixed(2)}</span></td>
        </tr>
      `;
    }).join('');

    // Render Podium
    const top3 = ranking.slice(0, 3);
    let podiumHtml = '';

    if (top3.length >= 2) {
      // 2nd Place
      podiumHtml += `
        <div class="podium-step silver">
          <div class="podium-badge">🥈</div>
          <div class="podium-title" title="${escapeHtml(top3[1].titulo_projeto)}">${escapeHtml(top3[1].titulo_projeto)}</div>
          <div class="podium-team">${escapeHtml(top3[1].nome_equipe)}</div>
          <div class="podium-score">${top3[1].nota_media.toFixed(2)}</div>
        </div>
      `;
    }

    if (top3.length >= 1) {
      // 1st Place
      podiumHtml += `
        <div class="podium-step gold">
          <div class="podium-badge">👑 🥇</div>
          <div class="podium-title" title="${escapeHtml(top3[0].titulo_projeto)}">${escapeHtml(top3[0].titulo_projeto)}</div>
          <div class="podium-team">${escapeHtml(top3[0].nome_equipe)}</div>
          <div class="podium-score">${top3[0].nota_media.toFixed(2)}</div>
        </div>
      `;
    }

    if (top3.length >= 3) {
      // 3rd Place
      podiumHtml += `
        <div class="podium-step bronze">
          <div class="podium-badge">🥉</div>
          <div class="podium-title" title="${escapeHtml(top3[2].titulo_projeto)}">${escapeHtml(top3[2].titulo_projeto)}</div>
          <div class="podium-team">${escapeHtml(top3[2].nome_equipe)}</div>
          <div class="podium-score">${top3[2].nota_media.toFixed(2)}</div>
        </div>
      `;
    }

    podium.innerHTML = podiumHtml;
  }

  function renderTeams(equipes) {
    const list = document.getElementById('teams-list');
    if (!equipes || equipes.length === 0) {
      list.innerHTML = '<p class="text-muted">Nenhuma equipe inscrita.</p>';
      return;
    }

    list.innerHTML = equipes.map(eq => {
      const membros = eq.participantes.map(p => `${escapeHtml(p.nome)} (${escapeHtml(p.matricula)})`).join(', ');
      const projInfo = eq.projeto ? `
        <div class="proj-badge">
          <strong>💡 ${escapeHtml(eq.projeto.titulo)}</strong>
          <span>${escapeHtml(eq.projeto.area_tematica)} • Nota: ${eq.projeto.nota_final.toFixed(2)}</span>
        </div>
      ` : '<span class="text-dim" style="font-size:0.75rem;">Nenhum projeto submetido</span>';

      return `
        <div class="team-card">
          <div class="team-card-header">
            <h4>${escapeHtml(eq.nome)}</h4>
            <span class="badge" style="font-size:0.7rem; color:var(--text-muted);">${eq.total_membros} membro(s)</span>
          </div>
          <div class="team-members-list">
            👤 ${membros}
          </div>
          ${projInfo}
        </div>
      `;
    }).join('');
  }

  async function populateSelects(data) {
    // Participants list for checkbox
    const resParts = await fetch('/api/participantes');
    const participants = await resParts.json();
    const checkList = document.getElementById('participants-checkbox-list');
    checkList.innerHTML = participants.map(p => `
      <label class="check-item">
        <input type="checkbox" name="part_ids" value="${p.id}">
        <span>${escapeHtml(p.nome)} (${escapeHtml(p.matricula)})</span>
      </label>
    `).join('');

    // Teams for project
    const projTeamSelect = document.getElementById('proj-team-select');
    const mentTeamSelect = document.getElementById('ment-team-select');
    const teamsWithoutProj = data.equipes.filter(e => !e.projeto);
    projTeamSelect.innerHTML = teamsWithoutProj.length ? 
      teamsWithoutProj.map(e => `<option value="${e.id}">${escapeHtml(e.nome)}</option>`).join('') :
      '<option value="">Todas as equipes já possuem projeto</option>';

    mentTeamSelect.innerHTML = data.equipes.map(e => `<option value="${e.id}">${escapeHtml(e.nome)}</option>`).join('');

    // Mentores & Jurados
    const resMent = await fetch('/api/mentores');
    const mentores = await resMent.json();
    const resJur = await fetch('/api/jurados');
    const jurados = await resJur.json();

    document.getElementById('ment-mentor-select').innerHTML = mentores.map(m => `<option value="${m.id}">${escapeHtml(m.nome)} (${escapeHtml(m.especialidade)})</option>`).join('');
    document.getElementById('eval-jurado-select').innerHTML = jurados.map(j => `<option value="${j.id}">${escapeHtml(j.nome)} (${escapeHtml(j.instituicao)})</option>`).join('');

    // Projects for evaluation
    document.getElementById('eval-proj-select').innerHTML = data.projetos.map(p => `<option value="${p.id}">${escapeHtml(p.titulo)}</option>`).join('');

    // Mentores and Jurados List tags
    document.getElementById('mentores-list').innerHTML = mentores.map(m => `<li><strong>${escapeHtml(m.nome)}</strong> • ${escapeHtml(m.especialidade)} (${escapeHtml(m.instituicao)})</li>`).join('');
    document.getElementById('jurados-list').innerHTML = jurados.map(j => `<li><strong>${escapeHtml(j.nome)}</strong> • ${escapeHtml(j.instituicao)}</li>`).join('');
  }

  function setupForms() {
    // Form Participante
    document.getElementById('form-participante').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        nome: document.getElementById('part-nome').value,
        email: document.getElementById('part-email').value,
        curso: document.getElementById('part-curso').value,
        matricula: document.getElementById('part-grr').value
      };
      await sendPost('/api/participantes', payload, 'Participante cadastrado com sucesso!', e.target);
    });

    // Form Equipe
    document.getElementById('form-equipe').addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll('input[name="part_ids"]:checked');
      const ids = Array.from(checkboxes).map(c => c.value);
      if (ids.length === 0) {
        showToast('Selecione pelo menos um participante para a equipe.', 'error');
        return;
      }
      const payload = {
        nome: document.getElementById('team-nome').value,
        hackathon_id: activeHackathonId,
        participantes_ids: ids
      };
      await sendPost('/api/equipes', payload, 'Equipe inscrita com sucesso!', e.target);
    });

    // Form Projeto
    document.getElementById('form-projeto').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        equipe_id: document.getElementById('proj-team-select').value,
        titulo: document.getElementById('proj-titulo').value,
        area_tematica: document.getElementById('proj-area').value,
        descricao: document.getElementById('proj-desc').value
      };
      await sendPost('/api/projetos', payload, 'Projeto registrado com sucesso!', e.target);
    });

    // Form Mentoria
    document.getElementById('form-mentoria').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        mentor_id: document.getElementById('ment-mentor-select').value,
        equipe_id: document.getElementById('ment-team-select').value,
        comentarios: document.getElementById('ment-comentarios').value
      };
      await sendPost('/api/mentorias', payload, 'Mentoria registrada com sucesso!', e.target);
    });

    // Form Avaliação
    document.getElementById('form-avaliacao').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        jurado_id: document.getElementById('eval-jurado-select').value,
        projeto_id: document.getElementById('eval-proj-select').value,
        nota: parseFloat(document.getElementById('eval-nota').value),
        comentarios: document.getElementById('eval-comentarios').value
      };
      await sendPost('/api/avaliacoes', payload, 'Avaliação registrada com sucesso!', e.target);
    });
  }

  async function sendPost(url, payload, successMsg, form) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro na operação.', 'error');
        return;
      }
      showToast(successMsg, 'success');
      form.reset();
      await refreshDashboard();
    } catch (err) {
      showToast('Erro de conexão: ' + err.message, 'error');
    }
  }

  function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
});
