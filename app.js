const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const LS = {
  checks: 'hs_checks_v1',
  notes: 'hs_notes_v1',
  settings: 'hs_settings_v1'
};

const subjects = [
  {
    id: 'math',
    name: 'Math',
    blurb: 'Daily practice + 1 concept to master. Fractions/decimals, multi-digit operations, word problems.',
    resources: ['Khan Academy 5th grade (free)', 'IXL (paid, great practice)', 'Beast Academy (if advanced)']
  },
  {
    id: 'ela',
    name: 'Reading & Writing',
    blurb: 'Read daily + short writing daily. Mix comprehension + grammar + real writing.',
    resources: ['Read aloud + independent reading', '1 paragraph summary/day', 'Weekly longer writing (1 page)']
  },
  {
    id: 'science',
    name: 'Science',
    blurb: '2–3 days/week. Hands-on when possible. Keep notes simple.',
    resources: ['Mystery Science (great)', 'Library books', 'Short experiments + write-up']
  },
  {
    id: 'social',
    name: 'Social Studies',
    blurb: '2 days/week. Maps, U.S. history, Texas connections.',
    resources: ['Map practice', 'Short documentaries', 'Notebooking pages']
  },
  {
    id: 'extras',
    name: 'Life Skills / Electives',
    blurb: 'Cooking, typing, art, music, budgeting, chores… all counts.',
    resources: ['Typing practice', 'Simple recipes', 'Project-based learning']
  }
];

const weekTemplate = {
  Mon: [
    { id: 'm_math', title: 'Math lesson + practice', meta: '30–45 min' },
    { id: 'm_read', title: 'Reading (independent)', meta: '20–30 min' },
    { id: 'm_write', title: 'Writing: 1 paragraph', meta: '10–15 min' },
    { id: 'm_vocab', title: 'Vocabulary / spelling', meta: '10–15 min' },
    { id: 'm_move', title: 'Movement break', meta: '10 min' },
  ],
  Tue: [
    { id: 't_math', title: 'Math practice + word problems', meta: '30–45 min' },
    { id: 't_read', title: 'Reading + discussion', meta: '20–30 min' },
    { id: 't_gram', title: 'Grammar/usage mini-lesson', meta: '10–15 min' },
    { id: 't_sci', title: 'Science lesson/activity', meta: '30–45 min' },
  ],
  Wed: [
    { id: 'w_math', title: 'Math lesson + practice', meta: '30–45 min' },
    { id: 'w_read', title: 'Reading (independent)', meta: '20–30 min' },
    { id: 'w_write', title: 'Writing: response/journal', meta: '10–15 min' },
    { id: 'w_social', title: 'Social Studies (maps/history)', meta: '30–45 min' },
  ],
  Thu: [
    { id: 'th_math', title: 'Math review + quiz', meta: '30–40 min' },
    { id: 'th_read', title: 'Reading + summary', meta: '20–30 min' },
    { id: 'th_sci', title: 'Science (lab/video + notes)', meta: '30–45 min' },
    { id: 'th_type', title: 'Typing practice', meta: '10–15 min' },
  ],
  Fri: [
    { id: 'f_math', title: 'Math games / real-life math', meta: '20–30 min' },
    { id: 'f_write', title: 'Weekly writing (1 page)', meta: '30–45 min' },
    { id: 'f_social', title: 'Social Studies', meta: '30–45 min' },
    { id: 'f_project', title: 'Project / elective', meta: '30–60 min' },
  ],
};

function loadJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, val){
  localStorage.setItem(key, JSON.stringify(val));
}

function renderWeek(){
  const root = $('#weekGrid');
  root.innerHTML = '';

  const checks = loadJSON(LS.checks, {});

  Object.entries(weekTemplate).forEach(([day, tasks]) => {
    const col = document.createElement('div');
    col.className = 'day';
    col.innerHTML = `<h3>${day}</h3>`;

    tasks.forEach(t => {
      const row = document.createElement('label');
      row.className = 'task';
      const checked = !!checks[t.id];
      row.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''} data-id="${t.id}" />
        <div class="t">
          <div>${t.title}</div>
          <span class="meta">${t.meta || ''}</span>
        </div>
      `;
      col.appendChild(row);
    });

    root.appendChild(col);
  });

  root.addEventListener('change', (e) => {
    if(e.target && e.target.matches('input[type=checkbox][data-id]')){
      const id = e.target.dataset.id;
      const next = loadJSON(LS.checks, {});
      next[id] = e.target.checked;
      saveJSON(LS.checks, next);
    }
  }, { once: true });
}

function renderSubjects(){
  const root = $('#subjectCards');
  root.innerHTML = '';
  subjects.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-title">${s.name}</div>
      <div class="card-sub">${s.blurb}</div>
      <div class="card-sub" style="margin-top:10px"><strong>Resources:</strong><br>${s.resources.map(r=>`• ${r}`).join('<br>')}</div>
    `;
    root.appendChild(card);
  });
}

function initSettings(){
  const settings = loadJSON(LS.settings, { studentName:'', weekOf:'', timeTarget:'3-4', style:'simple' });
  $('#studentName').value = settings.studentName || '';
  $('#weekOf').value = settings.weekOf || '';
  $('#timeTarget').value = settings.timeTarget || '3-4';
  $('#style').value = settings.style || 'simple';

  const save = () => {
    saveJSON(LS.settings, {
      studentName: $('#studentName').value,
      weekOf: $('#weekOf').value,
      timeTarget: $('#timeTarget').value,
      style: $('#style').value,
    });
  };
  ['studentName','weekOf','timeTarget','style'].forEach(id => {
    $('#'+id).addEventListener('change', save);
    $('#'+id).addEventListener('input', save);
  });

  // Notes
  $('#notes').value = localStorage.getItem(LS.notes) || '';
  $('#notes').addEventListener('input', () => localStorage.setItem(LS.notes, $('#notes').value));
}

function bindUI(){
  $('#btnPrint').addEventListener('click', () => window.print());
  $('#btnReset').addEventListener('click', () => {
    if(confirm('Reset all checkmarks for this week?')){
      localStorage.removeItem(LS.checks);
      renderWeek();
    }
  });

  // hash nav
  const setActive = () => {
    const h = location.hash || '#week';
    $$('.navlink').forEach(a => a.classList.toggle('active', a.getAttribute('href') === h));
  };
  window.addEventListener('hashchange', setActive);
  setActive();
}

renderWeek();
renderSubjects();
initSettings();
bindUI();
