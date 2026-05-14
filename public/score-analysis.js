// ══════════════════════════════════════════════
// 시험 누적 분석 — 전역 상태
// ══════════════════════════════════════════════
let srRoundCount = 0;
let srRoundData  = {};
let srPdfTypes   = {};
let srAnalysisResult = [];
let srCharts = {};
let srInitialized = false;

// 최초 탭 진입 시 초기화
function initScoreAnalysis() {
  if (srInitialized) return;
  srInitialized = true;
  srAddRound();
  srRestorePdfTypes();
}

// ── pdfTypes localStorage 복원 ──
function srRestorePdfTypes() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('sr_pdf_cache_')) continue;
    const parts = key.split('_');
    if (parts.length < 5) continue;
    const round = parseInt(parts[3]);
    if (isNaN(round) || srPdfTypes[round]) continue;
    try {
      srPdfTypes[round] = JSON.parse(localStorage.getItem(key));
    } catch(e) {}
  }
}

// ══════════════════════════════════════════════
// API 키 — 메인 앱에서 공유
// ══════════════════════════════════════════════
function srGetKey() {
  const isClaude = typeof isClaudeModel === 'function' && isClaudeModel();
  const provider = isClaude ? 'claude' : 'gemini';
  const key = document.getElementById('apiKeyInput')?.value.trim()
    || localStorage.getItem(isClaude ? 'claudeKey' : 'geminiKey') || '';
  return { provider, key };
}

// ══════════════════════════════════════════════
// 회차 패널
// ══════════════════════════════════════════════
function srAddRound() {
  const addBtn = document.getElementById('sr-btn-add');
  if (srRoundCount >= 5) { srToast('최대 5회차까지 추가 가능합니다', true); return; }
  srRoundCount++;
  const n = srRoundCount;
  const el = document.createElement('div');
  el.className = 'sr-round-panel';
  el.id = `sr-rp-${n}`;
  el.innerHTML = `
    <div class="sr-rp-head">
      <span class="sr-rp-label">📝 ${n}회차</span>
      <span class="sr-rp-status" id="sr-rp-status-${n}">데이터 없음</span>
      ${n > 1 ? `<button class="sr-rp-del" onclick="srDelRound(${n})">삭제</button>` : ''}
    </div>
    <div class="sr-rp-body">
      <div class="sr-rp-class-row">
        <label>반 이름</label>
        <input type="text" id="sr-class-name-${n}" placeholder="예: 청덕2반" value="">
        <span style="font-size:12px;color:var(--ink3)">※ 학교/반 컬럼이 없는 경우 여기에 입력</span>
      </div>
      <div class="sr-rp-uploads">
        <label class="sr-upload-btn" id="sr-pdf-btn-${n}" for="sr-pdf-inp-${n}">
          <span class="sr-icon">📄</span>
          <span>시험지 PDF 업로드<span class="sr-file-name" id="sr-pdf-fn-${n}">파일을 선택하세요</span></span>
        </label>
        <input type="file" id="sr-pdf-inp-${n}" accept=".pdf,application/pdf" style="display:none" onchange="srOnPdfUpload(event,${n})">
        <label class="sr-upload-btn" id="sr-xl-btn-${n}" for="sr-xl-inp-${n}">
          <span class="sr-icon">📊</span>
          <span>채점 엑셀 업로드<span class="sr-file-name" id="sr-xl-fn-${n}">파일을 선택하세요</span></span>
        </label>
        <input type="file" id="sr-xl-inp-${n}" accept=".xlsx,.xls,.csv" style="display:none" onchange="srOnExcelUpload(event,${n})">
        <span class="sr-pdf-tag wait hidden" id="sr-pdf-tag-${n}">유형 분석</span>
      </div>
      <div id="sr-pdf-log-${n}" style="display:none;font-size:11px;background:var(--sf2);border-radius:var(--r);padding:8px 12px;color:var(--ink3);line-height:1.8"></div>
      <div id="sr-xl-preview-${n}" class="hidden"></div>
    </div>`;
  document.getElementById('sr-rounds-list').appendChild(el);
  if (addBtn) addBtn.disabled = srRoundCount >= 5;
}

function srDelRound(n) {
  const el = document.getElementById(`sr-rp-${n}`);
  if (el) el.remove();
  delete srRoundData[n]; delete srPdfTypes[n];
  localStorage.removeItem(`sr_round_data_${n}`);
  srRoundCount = [...document.querySelectorAll('.sr-round-panel')].length;
  const addBtn = document.getElementById('sr-btn-add');
  if (addBtn) addBtn.disabled = srRoundCount >= 5;
}

function srSetRpStatus(n, txt) {
  const el = document.getElementById(`sr-rp-status-${n}`);
  if (el) el.textContent = txt;
}

function srGenerateDemoData() {
  if (!confirm("현재 입력된 데이터가 모두 삭제되고 데모 데이터(5회차, 10명)로 대체됩니다. 진행하시겠습니까?")) return;

  const existingRounds = [...document.querySelectorAll('.sr-round-panel')].map(el => parseInt(el.id.replace('sr-rp-', '')));
  existingRounds.forEach(n => srDelRound(n));
  srRoundCount = 0;

  const studentNames = ["김민준", "이서윤", "박도윤", "최지우", "정하준", "강서연", "조민서", "윤지호", "장서진", "임지안"];
  const typesList = ['제목', '주제', '순서', '삽입', '요약', '빈칸', '어법', '어휘', '함의추론', '내용일치', '무관한 문장'];

  for (let n = 1; n <= 5; n++) {
    srAddRound();
    document.getElementById(`sr-class-name-${n}`).value = "데모클래스";

    const qCount = 20;
    const qNums = Array.from({length: qCount}, (_, i) => String(i + 1));

    const types = {};
    qNums.forEach(q => { types[q] = typesList[Math.floor(Math.random() * typesList.length)]; });
    srPdfTypes[n] = types;
    localStorage.setItem(`sr_pdf_cache_${n}_demo`, JSON.stringify(types));

    const isDescMode = (document.querySelector('input[name="sr_desc_mode"]:checked')?.value === 'include');
    const objMaxScore = parseFloat(document.getElementById('sr-obj-max-score').value) || 80;
    const descMaxScore = parseFloat(document.getElementById('sr-desc-max-score').value) || 20;

    const students = studentNames.map(name => {
      const answers = {};
      let correct = 0;
      qNums.forEach(q => {
        const isCorrect = Math.random() > 0.25;
        answers[q] = isCorrect;
        if (isCorrect) correct++;
      });
      let score = 0, dScore = 0;
      if (isDescMode) {
        const calcObj = (correct / qCount) * objMaxScore;
        dScore = Math.round((0.5 + Math.random() * 0.5) * descMaxScore * 10) / 10;
        score = Math.round((calcObj + dScore) * 10) / 10;
      } else {
        score = Math.round((correct / qCount) * 100);
      }
      return { school: "데모고등학교", class: "데모클래스", name, answers, totalScore: score, descriptiveScore: dScore, correctCount: correct, questionCount: qCount };
    });

    const parsed = { className: "데모클래스", fileName: `demo_round_${n}.xlsx`, questionNums: qNums, students };
    srRoundData[n] = parsed;
    localStorage.setItem(`sr_round_data_${n}`, JSON.stringify(parsed));

    document.getElementById(`sr-xl-btn-${n}`).classList.add('done');
    document.getElementById(`sr-xl-fn-${n}`).textContent = parsed.fileName;
    const prev = document.getElementById(`sr-xl-preview-${n}`);
    prev.classList.remove('hidden');
    prev.className = 'sr-excel-preview';
    const avgScore = (students.reduce((a,b)=>a+b.totalScore,0)/10).toFixed(1);
    prev.innerHTML = `<strong>10명</strong> · <strong>${qCount}문항</strong> · 평균 <strong>${avgScore}점</strong> (데모 데이터)`;

    document.getElementById(`sr-pdf-btn-${n}`).classList.add('done');
    document.getElementById(`sr-pdf-fn-${n}`).textContent = `demo_round_${n}.pdf`;
    const tag = document.getElementById(`sr-pdf-tag-${n}`);
    tag.classList.remove('hidden');
    tag.className = 'sr-pdf-tag done';
    tag.textContent = `✅ 유형 확정 (${qCount}문항)`;

    srSetRpStatus(n, `✓ 데모 데이터 완료`);
  }
  srToast("데모 데이터 생성 완료. [분석 시작]을 눌러 결과를 확인하세요.");
}

// ══════════════════════════════════════════════
// 엑셀 파싱
// ══════════════════════════════════════════════
async function srOnExcelUpload(event, n) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';
  try {
    const parsed = await srParseExcel(file);
    let className = document.getElementById(`sr-class-name-${n}`).value.trim();
    if (!className) {
      className = file.name.replace(/\.[^.]+$/, '').replace(/채점결과|_채점결과|채점|결과/g, '').trim() || `${n}회차반`;
      document.getElementById(`sr-class-name-${n}`).value = className;
    }
    parsed.className = className;
    parsed.fileName = file.name;
    srRoundData[n] = parsed;
    localStorage.setItem(`sr_round_data_${n}`, JSON.stringify(parsed));

    const btn = document.getElementById(`sr-xl-btn-${n}`);
    btn.classList.add('done');
    document.getElementById(`sr-xl-fn-${n}`).textContent = file.name;

    const prev = document.getElementById(`sr-xl-preview-${n}`);
    prev.className = 'sr-excel-preview';
    const q = parsed.questionNums.length;
    const s = parsed.students.length;
    const avg = Math.round(parsed.students.reduce((a,b)=>a+b.totalScore,0)/s);
    prev.innerHTML = `<strong>${s}명</strong> · <strong>${q}문항</strong> · 평균 <strong>${avg}점</strong> 파싱 완료`;

    srSetRpStatus(n, `✓ 엑셀 완료 (${s}명 / ${q}문항)`);
    srToast(`${s}명, ${q}문항 데이터 로드 완료`);
  } catch(e) {
    srToast('엑셀 파일 형식 오류: ' + e.message, true);
  }
}

function srParseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        let nameCol = -1, scoreCol = -1;
        let qNums = [];
        let dataStartRow = 1;

        const row1 = (raw[1] || []);
        const numericInRow1 = row1.filter(v => typeof v === 'number' && v >= 1 && v <= 100).length;

        if (numericInRow1 >= 3) {
          dataStartRow = 2;
          const headers = (raw[0] || []).map(h => h == null ? '' : String(h).replace(/\s/g,'').toLowerCase());
          nameCol = headers.findIndex(h => h.includes('성명') || h.includes('이름') || h === 'name');
          if (nameCol === -1) nameCol = 2;
          scoreCol = headers.findIndex(h => h.includes('총점') || h.includes('score'));
          if (scoreCol === -1) scoreCol = 4;
          row1.forEach((v, i) => {
            if (typeof v === 'number' && v >= 1 && v <= 100) qNums.push({ col: i, num: String(Math.round(v)) });
          });
          if (qNums.length === 0) {
            row1.forEach((v, i) => {
              const n = parseInt(v);
              if (!isNaN(n) && n >= 1 && n <= 100) qNums.push({ col: i, num: String(n) });
            });
          }
        } else {
          dataStartRow = 1;
          const headers = (raw[0] || []).map(h => h == null ? '' : String(h).trim());
          nameCol = headers.findIndex(h => /이름|성명|name/i.test(h));
          if (nameCol === -1) nameCol = 2;
          scoreCol = headers.findIndex(h => /총점|합계|score/i.test(h));
          headers.forEach((h, i) => {
            const m = String(h).match(/^(\d+)\s*번?$/);
            if (m) qNums.push({ col: i, num: m[1] });
          });
        }

        const headers0 = (raw[0] || []).map(h => h == null ? '' : String(h).replace(/\s/g,''));
        const schoolCol = headers0.findIndex(h => /학교/i.test(h));
        const classCol  = headers0.findIndex(h => /^반$|^class$/i.test(h));
        const descCols  = [];
        headers0.forEach((h, i) => { if (/서술|단답|주관|논술/i.test(h)) descCols.push(i); });

        let maxValidCol = -1;
        for (let r = dataStartRow; r < raw.length; r++) {
          if (!raw[r] || !raw[r][nameCol]) continue;
          for (let i = qNums.length - 1; i >= 0; i--) {
            if (qNums[i].col <= maxValidCol) break;
            const v = String(raw[r][qNums[i].col] ?? '').trim();
            if (v !== '') { maxValidCol = qNums[i].col; break; }
          }
        }
        if (maxValidCol !== -1) {
          const trailingEmpty = qNums.filter(q => q.col > maxValidCol).length;
          if (trailingEmpty >= 5) qNums = qNums.filter(q => q.col <= maxValidCol);
        }

        const students = [];
        for (let r = dataStartRow; r < raw.length; r++) {
          const row = raw[r];
          if (!row || !row[nameCol]) continue;
          const name = String(row[nameCol]).trim();
          if (!name) continue;

          const answers = {};
          if (qNums.length > 0) {
            qNums.forEach(({ col, num }) => {
              const v = String(row[col] ?? '').trim().toUpperCase();
              answers[num] = (v === 'O' || v === '1' || v === 'TRUE');
            });
          }

          let dScore = 0;
          descCols.forEach(col => { const v = parseFloat(row[col]); if (!isNaN(v)) dScore += v; });

          let score = null;
          if (scoreCol !== -1 && row[scoreCol] != null && String(row[scoreCol]).trim() !== '') {
            score = parseFloat(row[scoreCol]);
          }
          if (score == null || isNaN(score)) {
            const correct = Object.values(answers).filter(Boolean).length;
            const totalObj = qNums.length || 1;
            const isDescMode = (document.querySelector('input[name="sr_desc_mode"]:checked')?.value === 'include');
            if (isDescMode) {
              const objMaxScore = parseFloat(document.getElementById('sr-obj-max-score').value) || 80;
              score = Math.round(((correct / totalObj) * objMaxScore + dScore) * 10) / 10;
            } else {
              score = Math.round(correct / totalObj * 100);
            }
          }

          students.push({
            school: schoolCol !== -1 ? String(row[schoolCol] || '').trim() : '',
            class:  classCol  !== -1 ? String(row[classCol]  || '').trim() : '',
            name, answers, totalScore: score, descriptiveScore: dScore,
            correctCount: Object.values(answers).filter(Boolean).length,
            questionCount: qNums.length
          });
        }
        if (students.length === 0) throw new Error('학생 데이터를 찾을 수 없습니다');
        resolve({ students, questionNums: qNums.map(q=>q.num) });
      } catch(err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ══════════════════════════════════════════════
// PDF 업로드 & 유형 추출
// ══════════════════════════════════════════════
const srPdfFileStore = {};

async function srOnPdfUpload(event, n, forceApi = false) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';
  srPdfFileStore[n] = file;

  const hash = btoa(encodeURIComponent(file.name + file.size)).replace(/[^a-z0-9]/gi,'').substring(0,20);
  document.getElementById(`sr-pdf-fn-${n}`).textContent = file.name;
  document.getElementById(`sr-pdf-btn-${n}`).classList.add('done');

  const { provider, key } = srGetKey();
  if (!key) {
    srShowPdfStatus(n, '❌ API 키가 없습니다. 상단에서 저장해주세요.', 'err');
    return;
  }

  srShowPdfStatus(n, `🔍 ${provider.toUpperCase()} AI가 PDF 유형을 추출 중입니다... (10~30초 소요)`, 'doing');

  try {
    const b64 = await srFileToBase64(file);
    srShowPdfStatus(n, '📡 API 호출 중...', 'doing');
    const types = await srCallApiForTypes(b64);
    srRenderTypeConfirmUI(n, types, hash);
  } catch(err) {
    let errorMsg = err.message;
    if (errorMsg.includes('Failed to fetch')) {
      errorMsg = '브라우저 보안 정책(CORS) 또는 네트워크 차단으로 인해 API 서버와 연결할 수 없습니다.\n\n해결 방법:\n1. 상단 설정에서 제공자를 "Gemini (Google)"로 변경해보세요.\n2. 광고 차단 프로그램(AdBlock 등)을 잠시 꺼주세요.';
    }
    srShowPdfStatus(n, `❌ 오류: ${errorMsg}`, 'err');
    alert(`PDF 유형 분석 실패\n\n${errorMsg}`);
  }
}

function srShowPdfStatus(n, msg, state) {
  const tag = document.getElementById(`sr-pdf-tag-${n}`);
  if (tag) {
    tag.classList.remove('hidden');
    tag.className = `sr-pdf-tag ${state === 'doing' ? 'doing' : state === 'err' ? 'err' : 'wait'}`;
    tag.textContent = state === 'doing' ? '⏳ 분석 중...' : state === 'err' ? '❌ 실패' : '⚠ 확인 필요';
  }
  const area = document.getElementById(`sr-pdf-log-${n}`);
  if (area) {
    area.style.display = 'block';
    if (state === 'err') {
      area.innerHTML = `
        <div style="color:var(--ac);padding:4px 0">${msg}</div>
        <button onclick="srRetryPdf(${n})" style="margin-top:8px;background:#fff;border:1.5px solid var(--ac);color:var(--ac);border-radius:6px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer">🔄 재시도</button>`;
    } else {
      area.innerHTML = `<div style="color:var(--bl);padding:4px 0">${msg}</div>`;
    }
  }
}

function srRetryPdf(n) {
  const file = srPdfFileStore[n];
  if (file) {
    srOnPdfUpload({ target: { files: [file] } }, n, true);
  } else {
    document.getElementById(`sr-pdf-inp-${n}`).click();
  }
}
window.srRetryPdf = srRetryPdf;

function srRenderTypeConfirmUI(n, types, hash) {
  const area = document.getElementById(`sr-pdf-log-${n}`);
  if (!area) return;

  const tag = document.getElementById(`sr-pdf-tag-${n}`);
  if (tag) { tag.classList.remove('hidden'); tag.className = 'sr-pdf-tag wait'; tag.textContent = '⚠ 유형 확인 필요'; }

  const sorted = Object.entries(types).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));
  area.style.display = 'block';
  area.dataset.pendingTypes = JSON.stringify(types);
  area.dataset.hash = hash;
  area.innerHTML = '';

  const title = document.createElement('div');
  title.style.cssText = 'font-size:12px;font-weight:700;color:var(--ink);margin-bottom:8px';
  title.textContent = `📋 추출된 유형 ${sorted.length}문항 — 잘못된 유형은 클릭해서 수정하세요`;
  area.appendChild(title);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px';
  area.appendChild(grid);

  sorted.forEach(([num, typeName]) => {
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;background:var(--bls);border:1px solid var(--bd2);border-radius:20px;padding:3px 10px;font-size:12px;cursor:pointer;user-select:none';
    chip.title = '클릭하여 수정';

    const numSpan = document.createElement('span');
    numSpan.style.cssText = 'color:var(--ink3);font-size:10px';
    numSpan.textContent = num + '번';

    const typeSpan = document.createElement('span');
    typeSpan.className = 'sr-type-val';
    typeSpan.style.cssText = 'font-weight:700;color:var(--bl);margin-left:2px';
    typeSpan.textContent = typeName;

    chip.appendChild(numSpan);
    chip.appendChild(typeSpan);
    chip.addEventListener('click', () => srEditTypeChip(n, num, chip, area));
    grid.appendChild(chip);
  });

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap';

  const confirmBtn = document.createElement('button');
  confirmBtn.style.cssText = 'background:var(--gr);color:#fff;border:none;border-radius:99px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit';
  confirmBtn.textContent = '✅ 유형 확정';
  confirmBtn.addEventListener('click', () => srConfirmTypes(n));
  btnRow.appendChild(confirmBtn);

  const reBtn = document.createElement('button');
  reBtn.style.cssText = 'background:#fff;border:1.5px solid var(--bd2);color:var(--ink3);border-radius:99px;padding:8px 14px;font-size:12px;cursor:pointer;font-family:inherit';
  reBtn.textContent = '🔄 재분석';
  reBtn.addEventListener('click', () => {
    const file = srPdfFileStore[n];
    if (file) srOnPdfUpload({ target: { files: [file] } }, n, true);
    else document.getElementById(`sr-pdf-inp-${n}`).click();
  });
  btnRow.appendChild(reBtn);

  area.appendChild(btnRow);
}

function srEditTypeChip(n, num, chip, area) {
  const valSpan = chip.querySelector('.sr-type-val');
  if (!valSpan || chip.querySelector('input')) return;
  const current = valSpan.textContent;
  const input = document.createElement('input');
  input.value = current;
  input.style.cssText = 'width:55px;border:none;background:transparent;font-size:12px;font-weight:700;color:var(--bl);outline:none;font-family:inherit';
  valSpan.replaceWith(input);
  input.focus(); input.select();
  const finish = () => {
    const newVal = input.value.trim() || current;
    valSpan.textContent = newVal;
    input.replaceWith(valSpan);
    if (area?.dataset.pendingTypes) {
      const t = JSON.parse(area.dataset.pendingTypes);
      t[num] = newVal;
      area.dataset.pendingTypes = JSON.stringify(t);
    }
  };
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); if (e.key === 'Escape') { input.value = current; input.blur(); } });
}

function srConfirmTypes(n) {
  const area = document.getElementById(`sr-pdf-log-${n}`);
  if (!area?.dataset.pendingTypes) { alert('확정할 유형 데이터가 없습니다.'); return; }
  const types = JSON.parse(area.dataset.pendingTypes);
  srPdfTypes[n] = types;
  const cnt = Object.keys(types).length;
  const tag = document.getElementById(`sr-pdf-tag-${n}`);
  if (tag) { tag.className = 'sr-pdf-tag done'; tag.textContent = `✅ 유형 확정 (${cnt}문항)`; }

  const sorted = Object.entries(types).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));
  area.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--gr);margin-bottom:6px">
      ✅ 유형 확정 완료 (${cnt}문항) &nbsp;
      <span style="font-weight:400;color:var(--ink3);cursor:pointer;text-decoration:underline" onclick="document.getElementById('sr-pdf-inp-${n}').click()">PDF 다시 업로드</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${sorted.map(([num,t]) => `<span style="background:var(--grs);border:1px solid var(--gr);border-radius:12px;padding:2px 8px;font-size:11px"><span style="color:var(--ink3);font-size:9px">${num}번</span> <strong>${t}</strong></span>`).join('')}
    </div>`;

  srSetRpStatus(n, `✓ PDF 유형 확정 (${cnt}문항)`);
  srToast(`${cnt}문항 유형 확정 완료`);
}

async function srCallApiForTypes(base64PDF) {
  const { provider, key } = srGetKey();
  if (!key) throw new Error('API 키가 없습니다');

  const prompt = `이 시험지 PDF에서 각 문항번호와 문제 유형을 추출해줘.
문제 유형은 다음 12가지 중에서만 선택해:
제목, 주제, 순서, 삽입, 요약, 빈칸, 어법, 어휘, 함의추론, 내용일치, 무관한 문장, 논술형

[최우선 절대 규칙]
문제 번호 주변이나 지시문에 "서술형", "논술형", "주관식", "단답형" 이라는 단어가 하나라도 포함되어 있거나, 객관식 선지(1~5번)가 없이 직접 쓰는 문제라면, 다른 특성(요약, 빈칸 등)이 있더라도 무조건 "논술형"으로 분류해.

분류 기준:
- "주제로 가장 적절한 것" → 주제
- "제목으로 가장 적절한 것" → 제목
- "빈칸에 들어갈 말로 가장 적절한" → 빈칸
- "순서로 가장 적절한" → 순서
- "문장이 들어가기에 가장 적절한 곳" → 삽입
- 어법/문법 관련 → 어법
- 어휘/낱말/쓰임 관련 → 어휘
- "요약문" 관련 → 요약
- "밑줄 친 부분이 의미하는 바" → 함의추론
- "내용과 일치하지 않는 것/일치하는 것" → 내용일치
- "전체 흐름과 관계 없는 문장" → 무관한 문장

위 12가지 유형에 해당하지 않거나 판단이 모호한 경우에만 "기타"라고 표시해줘.

반드시 아래 JSON 형식으로만 응답해. 마크다운 코드블록 없이, 순수 JSON만:
{"1":"주제","2":"빈칸","3":"순서"}`;

  let text = '';

  if (provider === 'claude') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [{ role: 'user', content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64PDF } },
          { type: 'text', text: prompt }
        ]}]
      })
    });
    const rawText = await res.text();
    let d;
    try { d = JSON.parse(rawText); } catch(e) { throw new Error(`Claude 응답 파싱 실패: ${rawText.substring(0,300)}`); }
    if (!res.ok) throw new Error(`Claude 오류 (HTTP ${res.status}): ${d.error?.message || JSON.stringify(d).substring(0,200)}`);
    text = d.content?.[0]?.text || '';
  } else {
    const geminiModel = document.getElementById('modelSelect')?.value || 'gemini-2.5-flash';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [
          { inline_data: { mime_type: 'application/pdf', data: base64PDF } },
          { text: prompt }
        ]}]})
      }
    );
    const rawText = await res.text();
    let d;
    try { d = JSON.parse(rawText); } catch(e) { throw new Error(`Gemini 응답 파싱 실패: ${rawText.substring(0,300)}`); }
    if (!res.ok) throw new Error(`Gemini 오류 (HTTP ${res.status}): ${d.error?.message || d.error?.status || JSON.stringify(d).substring(0,200)}`);
    if (!d.candidates?.length) throw new Error(`Gemini 응답에 candidates 없음`);
    text = d.candidates[0]?.content?.parts?.[0]?.text || '';
  }

  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim();
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`JSON 파싱 실패. API 응답: ${text.substring(0, 200)}`);
  const parsed = JSON.parse(m[0]);
  if (Object.keys(parsed).length === 0) throw new Error('유형 데이터가 비어있습니다. PDF 내용을 확인해주세요.');
  return parsed;
}

// ══════════════════════════════════════════════
// 분석 시작
// ══════════════════════════════════════════════
let srGlobalRoundStats = {};

async function srStartAnalysis() {
  const validRounds = Object.keys(srRoundData).map(Number).sort((a,b)=>a-b);
  if (!validRounds.length) { srToast('최소 1개 회차의 엑셀을 업로드해주세요', true); return; }

  const roundsWithoutPdf = validRounds.filter(r => !srPdfTypes[r] || Object.keys(srPdfTypes[r]).length === 0);
  if (roundsWithoutPdf.length > 0) {
    const msg = `⚠️ PDF 유형 미등록 회차: ${roundsWithoutPdf.map(r=>r+'회차').join(', ')}\n\nPDF 없이 분석하면 유형 대신 문항 번호(1번, 2번...)로 표시됩니다.\n\n계속 진행하시겠습니까?`;
    if (!confirm(msg)) return;
  }

  const pw = document.getElementById('sr-progress-wrap');
  const pb = document.getElementById('sr-prog-bar');
  const pt = document.getElementById('sr-prog-text');
  const analyzeBtn = document.getElementById('sr-btn-analyze');
  pw.classList.add('on');
  if (analyzeBtn) analyzeBtn.disabled = true;

  try {
    srSetProg(pb, pt, 10, '데이터 집계 중...');
    await srTick(50);
    srAnalysisResult = srComputeCumulative(validRounds);
    srSetProg(pb, pt, 98, '렌더링 중...');
    await srTick(100);
    srRenderResults();
    pw.classList.remove('on');
    const resultSec = document.getElementById('sr-result-section');
    resultSec.style.display = 'block';
    resultSec.scrollIntoView({ behavior: 'smooth' });
  } catch(e) {
    pw.classList.remove('on');
    srToast('분석 오류: ' + e.message, true);
    console.error(e);
  }
  if (analyzeBtn) analyzeBtn.disabled = false;
}

function srSetProg(bar, txt, pct, msg) {
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = msg;
}
const srTick = (ms=50) => new Promise(r => setTimeout(r, ms));

// ══════════════════════════════════════════════
// 누적 분석 계산
// ══════════════════════════════════════════════
function srComputeCumulative(rounds) {
  srGlobalRoundStats = {};
  rounds.forEach(r => {
    const rd = srRoundData[r];
    const scores = rd.students.map(s => s.totalScore);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length * 10) / 10;

    const dist = { '100': 0, '90': 0, '80': 0, '70': 0, '60': 0, '50': 0, '0': 0 };
    scores.forEach(score => {
      if (score === 100) dist['100']++;
      else if (score >= 90) dist['90']++;
      else if (score >= 80) dist['80']++;
      else if (score >= 70) dist['70']++;
      else if (score >= 60) dist['60']++;
      else if (score >= 50) dist['50']++;
      else dist['0']++;
    });
    const distPct = {};
    for (let k in dist) distPct[k] = Math.round(dist[k] / scores.length * 100);

    let diffLabel = '';
    if (avg <= 61) diffLabel = '어려움';
    else if (avg <= 65) diffLabel = '중상';
    else if (avg <= 69) diffLabel = '보통';
    else diffLabel = '쉬움';

    const sortedScores = [...scores].sort((a,b)=>b-a);
    const descScores = rd.students.map(s => s.descriptiveScore || 0);
    const objScores = rd.students.map(s => s.totalScore - (s.descriptiveScore || 0));
    const avgDesc = (descScores.reduce((a,b)=>a+b,0)/descScores.length).toFixed(1);
    const avgObj = (objScores.reduce((a,b)=>a+b,0)/objScores.length).toFixed(1);

    srGlobalRoundStats[r] = { max, min, avg: avg.toFixed(1), avgObj, avgDesc, dist, distPct, diffLabel, totalStudents: scores.length, sortedScores };
  });

  const map = {};
  rounds.forEach(r => {
    const rd = srRoundData[r];
    rd.students.forEach(s => {
      const cls = s.class || rd.className || '';
      const key = `${s.school || ''}||${s.name}`;
      if (!map[key]) {
        map[key] = { name: s.name, class: cls, school: s.school, rounds: {} };
      } else if (cls) {
        map[key].class = cls;
      }
      map[key].rounds[r] = s;
    });
  });

  const all = Object.values(map).map(st => {
    const rnds = Object.keys(srGlobalRoundStats).map(Number).sort((a,b)=>a-b);

    const roundDetails = rnds.map((r, idx) => {
      if (!st.rounds[r]) return { r, isAbsent: true, score: '-', diff: null, topPct: '-', descScore: '-' };
      const score = st.rounds[r].totalScore;
      const descScore = st.rounds[r].descriptiveScore || 0;
      let prevScore = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (st.rounds[rnds[i]]) { prevScore = st.rounds[rnds[i]].totalScore; break; }
      }
      const diff = prevScore !== null ? score - prevScore : null;
      const gStat = srGlobalRoundStats[r];
      const rank = gStat.sortedScores.findIndex(x => x <= score) + 1;
      const topPct = Math.round((rank - 1) / gStat.totalStudents * 1000) / 10 || 0;
      return { r, score, diff, topPct, descScore };
    });

    const scores = rnds.map(r => st.rounds[r] ? st.rounds[r].totalScore : null);
    const validScores = scores.filter(s => s !== null);
    const avg = validScores.length ? Math.round(validScores.reduce((a,b)=>a+b,0)/validScores.length*10)/10 : 0;
    let lastDetail = null;
    for (let i = roundDetails.length - 1; i >= 0; i--) {
      if (!roundDetails[i].isAbsent) { lastDetail = roundDetails[i]; break; }
    }

    const typeStats = {};
    rnds.forEach(r => {
      const s = st.rounds[r];
      if (!s) return;
      const tm = srPdfTypes[r] || {};
      const hasPdf = Object.keys(tm).length > 0;
      const qNums = srRoundData[r].questionNums || [];
      qNums.forEach(num => {
        const typeName = hasPdf ? tm[num] : null;
        const finalType = typeName || (hasPdf ? '기타' : `${num}번`);
        if (!typeStats[finalType]) typeStats[finalType] = { correct:0, total:0, byRound: {} };
        if (!typeStats[finalType].byRound[r]) typeStats[finalType].byRound[r] = { correct:0, total:0 };
        typeStats[finalType].total++;
        typeStats[finalType].byRound[r].total++;
        if (s.answers[num]) { typeStats[finalType].correct++; typeStats[finalType].byRound[r].correct++; }
      });
    });

    const typeRates = {};
    Object.entries(typeStats).forEach(([t, data]) => {
      const roundRates = {};
      Object.entries(data.byRound).forEach(([r, rData]) => {
        roundRates[r] = Math.round(rData.correct / rData.total * 100);
      });
      typeRates[t] = { correct: data.correct, total: data.total, rate: Math.round(data.correct/data.total*100), roundRates };
    });

    const sorted = Object.entries(typeRates).filter(([t]) => t !== '기타').sort((a,b)=>b[1].rate-a[1].rate);
    const weakTypes = sorted.slice(-3).reverse().map(([t, data])=>({ name: t, ...data }));
    const lastRound = st.rounds[rnds[rnds.length-1]];

    return {
      name: st.name, class: st.class, school: st.school, rnds, scores, avg,
      lastTopPct: lastDetail?.topPct || 0,
      roundDetails, typeRates, weakTypes,
      lastDescriptiveScore: lastRound?.descriptiveScore || 0
    };
  });

  all.sort((a,b) => b.avg - a.avg);
  all.forEach((s, i) => {
    s.allRank = i + 1;
    s.allTop = all.length > 1 ? Math.round(i / all.length * 1000) / 10 : 0;
  });

  return all;
}

// ══════════════════════════════════════════════
// 결과 렌더링
// ══════════════════════════════════════════════
let srCurrentStudentIdx = 0;
let srCurrentList = [];

function srRenderResults() {
  const classSel = document.getElementById('sr-class-select');
  classSel.innerHTML = '<option value="ALL">전체</option>';
  const classes = [...new Set(srAnalysisResult.map(s => s.class).filter(Boolean))];
  classes.forEach(c => { const o=document.createElement('option'); o.value=c; o.textContent=c; classSel.appendChild(o); });
  srBuildStudentDropdown();
}

function srBuildStudentDropdown() {
  const cls = document.getElementById('sr-class-select').value;
  srCurrentList = (cls==='ALL' ? srAnalysisResult : srAnalysisResult.filter(s=>(s.class||'')==cls))
    .slice().sort((a,b)=>b.avg-a.avg);

  const sel = document.getElementById('sr-student-select');
  sel.innerHTML = '';
  srCurrentList.forEach((s, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = `${i+1}등 ${s.name}${s.class ? ` (${s.class})` : ''} — ${s.avg}점`;
    sel.appendChild(o);
  });
  sel.value = 0;
  srCurrentStudentIdx = 0;
  srRenderSingleCard(0);
}

function srOnClassChange() { srBuildStudentDropdown(); }
function srOnStudentChange() {
  srCurrentStudentIdx = parseInt(document.getElementById('sr-student-select').value) || 0;
  srRenderSingleCard(srCurrentStudentIdx);
}

function srRenderSingleCard(idx) {
  Object.values(srCharts).forEach(c=>c.destroy()); srCharts={};
  const area = document.getElementById('sr-student-single');
  area.innerHTML = '';
  if (!srCurrentList.length) return;

  const s = srCurrentList[idx];
  const safeId = ('card_'+(s.class||'c')+'_'+s.name).replace(/[^a-z0-9_]/gi,'_');

  const wrap = document.createElement('div');
  wrap.className = 'sr-student-preview-wrap';
  wrap.innerHTML = `
    <div class="sr-preview-bar">
      <span>${s.name}${s.class ? ` · ${s.class}` : ''} &nbsp;|&nbsp; 전체 ${s.allRank}등 (상위 ${s.allTop}%)</span>
      <button class="sr-btn-save-one" onclick="srSavePNG('${safeId}','${s.name}')">⬇ PNG 저장</button>
    </div>
    <div class="sr-scale-wrap" id="sr-sw-${safeId}">${srBuildCard(s, safeId)}</div>`;
  area.appendChild(wrap);

  requestAnimationFrame(() => {
    const sw = document.getElementById(`sr-sw-${safeId}`);
    if (sw) {
      const parentW = sw.parentElement.clientWidth;
      const sc = parentW / 794;
      sw.style.transform = `scale(${sc})`;
      sw.style.height = (1123*sc)+'px';
      sw.style.transformOrigin = 'top left';
      sw.style.overflow = 'hidden';
    }
    srInitChart(s, safeId);
  });
}

function srSaveCurPNG() {
  if (!srCurrentList.length) return;
  const s = srCurrentList[srCurrentStudentIdx];
  const id = ('card_'+(s.class||'c')+'_'+s.name).replace(/[^a-z0-9_]/gi,'_');
  srSavePNG(id, s.name);
}

// ══════════════════════════════════════════════
// A4 카드 HTML 생성
// ══════════════════════════════════════════════
function srBuildCard(s, id) {
  const today = new Date().toLocaleDateString('ko-KR', {year:'numeric',month:'long',day:'numeric'});
  const titleRounds = s.rnds.map(r=>`${r}차`).join(' · ');
  const titleExam = (srRoundData[s.rnds[s.rnds.length-1]]?.className || '') + ' 모의시험';

  let scoreTableHtml = '';
  let descTableHtml = '';

  const descMode = document.querySelector('input[name="sr_desc_mode"]:checked')?.value || 'include';
  const hasDesc = descMode === 'include' && s.roundDetails.some(rd => rd.descScore > 0);
  const rowPad = Math.max(3, 10 - s.rnds.length * 2) + 'px';
  const tdStyle = `padding-top:${rowPad};padding-bottom:${rowPad}`;

  s.roundDetails.forEach((rd, idx) => {
    const isLatest = idx === s.roundDetails.length - 1;
    if (rd.isAbsent) {
      scoreTableHtml += `<tr><td class="tc-round" style="text-align:left;padding-left:20px;${tdStyle}">${rd.r}차 ${isLatest ? '<span class="badge-new">최신</span>' : ''}</td><td class="tc-score" style="color:#888;${tdStyle}">미응시</td><td class="tc-pct" style="color:#888;${tdStyle}">-</td></tr>`;
      if (hasDesc) descTableHtml += `<tr><td class="tc-round">${rd.r}차</td><td style="color:#888;font-weight:400">-</td><td style="color:#888;font-weight:400">-</td></tr>`;
      return;
    }
    scoreTableHtml += `<tr><td class="tc-round" style="text-align:left;padding-left:20px;${tdStyle}">${rd.r}차 ${isLatest ? '<span class="badge-new">최신</span>' : ''}</td><td class="tc-score" style="${tdStyle}">${rd.score} <small>점</small></td><td class="tc-pct" style="${tdStyle}">상위 ${rd.topPct}%</td></tr>`;
    if (hasDesc) {
      const objScore = rd.score - rd.descScore;
      const gStat = srGlobalRoundStats[rd.r];
      descTableHtml += `<tr><td class="tc-round" style="${tdStyle}">${rd.r}차</td><td style="color:#2E4A7A;font-weight:700;${tdStyle}">${Number(objScore).toFixed(1)} <small>점</small> <span style="font-size:10px;color:#888;font-weight:400">${gStat.avgObj != null ? '(' + gStat.avgObj + ')' : ''}</span></td><td style="color:#C0392B;font-weight:700;${tdStyle}">${Number(rd.descScore).toFixed(1)} <small>점</small> <span style="font-size:10px;color:#888;font-weight:400">${gStat.avgDesc != null ? '(' + gStat.avgDesc + ')' : ''}</span></td></tr>`;
    }
  });

  let diffBoxesHtml = '';
  s.rnds.forEach(r => {
    const gStat = srGlobalRoundStats[r];
    let diffClass = gStat.diffLabel === '어려움' ? 'diff-hard' : gStat.diffLabel === '중상' ? 'diff-mhard' : gStat.diffLabel === '보통' ? 'diff-normal' : 'diff-easy';
    diffBoxesHtml += `<div class="diff-box ${diffClass}"><div class="r-lbl">${r}차</div><div class="r-score">${gStat.avg}<br><small>점</small></div><div class="r-badge">난이도<br>${gStat.diffLabel}</div></div>`;
  });

  let weakBoxesHtml = '';
  for (let i = 0; i < 3; i++) {
    const w = s.weakTypes[i];
    if (w) {
      weakBoxesHtml += `<div class="weak-box"><div class="weak-lbl">🥇 약점 ${i+1}위</div><div class="weak-name">${w.name}</div><div class="weak-rate">${w.rate}%</div></div>`;
    } else {
      weakBoxesHtml += `<div class="weak-box" style="opacity:0.3;border-top-color:#ccc"><div class="weak-lbl">약점 ${i+1}위</div><div class="weak-name">데이터 부족</div></div>`;
    }
  }

  const typeEntries = Object.entries(s.typeRates).filter(([t]) => !t.endsWith('번') && t !== '기타');
  let typeGridHtml = '';
  if (typeEntries.length > 0) {
    const sortedTypes = typeEntries.sort((a, b) => a[1].rate - b[1].rate);
    let cellsHtml = '';
    sortedTypes.forEach(([typeName, data]) => {
      const rate = data.rate;
      const rateColor = rate < 50 ? '#C0392B' : rate < 70 ? '#E67E22' : rate < 85 ? '#4A7CC7' : '#27AE60';
      cellsHtml += `<div class="type-cell"><div class="type-cell-name">${typeName}</div><div class="type-cell-rate" style="color:${rateColor}">${rate}%</div></div>`;
    });
    typeGridHtml = `<div class="sec-title" style="margin-top:10px">전체 유형별 정답률</div><div class="type-grid">${cellsHtml}</div>`;
  }

  let distHeaderHtml = '';
  s.rnds.forEach(r => {
    const gStat = srGlobalRoundStats[r];
    distHeaderHtml += `<div class="dist-h-col"><div class="dist-h-lbl" style="color:#666;font-weight:700">${r}차</div><div class="dist-h-stats"><span>최고 <span class="dist-max">${gStat.max}</span></span><span>최저 <span class="dist-min">${gStat.min}</span></span></div></div>`;
  });

  const ranges = ['100', '90', '80', '70', '60', '50', '0'];
  const rangeLabels = ['100점', '90 ~ 99점', '80 ~ 89점', '70 ~ 79점', '60 ~ 69점', '50 ~ 59점', '0 ~ 49점'];
  const rowColors = ['#D0DBF0','#27AE60','#4A7CC7','#E67E22','#D35400','#C0392B','#800000'];

  let distTableHtml = '';
  ranges.forEach((rng, idx) => {
    const rColor = rowColors[idx];
    let rowHtml = `<tr><th><span style="color:${rColor};font-size:8px">■</span> ${rangeLabels[idx]}</th>`;
    s.roundDetails.forEach(rd => {
      const pct = srGlobalRoundStats[rd.r].distPct[rng];
      let isMyRange = (rng === '100' && rd.score === 100) || (rng === '90' && rd.score >= 90 && rd.score < 100) || (rng === '80' && rd.score >= 80 && rd.score < 90) || (rng === '70' && rd.score >= 70 && rd.score < 80) || (rng === '60' && rd.score >= 60 && rd.score < 70) || (rng === '50' && rd.score >= 50 && rd.score < 60) || (rng === '0' && rd.score < 50);
      const myBadge = isMyRange ? '<span class="my-badge">나</span>' : '';
      rowHtml += `<td style="color:${pct === 0 ? '#D0DBF0' : rColor};font-weight:${pct === 0 ? 400 : 700}">${pct}% ${myBadge}</td>`;
    });
    rowHtml += '</tr>';
    distTableHtml += rowHtml;
  });

  const descSectionHtml = hasDesc ? `
    <div style="flex:1">
      <div class="sec-title">객관식 / 논술형 점수</div>
      <table class="score-table"><thead><tr><th>회차</th><th>객관식 (평균)</th><th>논술형 (평균)</th></tr></thead><tbody>${descTableHtml}</tbody></table>
    </div>` : '';

  return `
    <div class="student-card" id="${id}">
      <div style="background:#1B2E4B;color:#fff;padding:12px 24px;margin:-20px -30px 10px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;word-break:keep-all;">
        <div style="display:flex;align-items:center;gap:15px;min-width:0;">
          <div style="font-size:20px;font-weight:700;letter-spacing:-1px;white-space:nowrap;">${s.name}</div>
          <div style="font-size:12px;opacity:0.9;margin-top:2px;white-space:nowrap;">개인 성적 리포트</div>
          <div style="font-size:11px;opacity:0.6;margin-top:4px;white-space:nowrap;">${titleRounds} · [모의평가] ${titleExam}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;font-size:12px;white-space:nowrap;flex-shrink:0;">
          <div>회차 평균 <strong style="font-size:16px;color:#fff;margin-left:2px;">${Number(s.avg).toFixed(1)}점</strong></div>
          <div style="width:1px;height:14px;background:rgba(255,255,255,0.3);"></div>
          <div>평균 기준 <strong style="font-size:16px;color:#90CAF9;margin-left:2px;">상위 ${s.allTop}%</strong></div>
        </div>
      </div>
      <div style="display:flex;gap:15px;">
        <div style="flex:1">
          <div class="sec-title">성적 현황</div>
          <table class="score-table"><thead><tr><th>회차</th><th>총점</th><th>상위 백분율</th></tr></thead><tbody>${scoreTableHtml}</tbody></table>
        </div>
        ${descSectionHtml}
      </div>
      <div class="sec-title" style="margin-top:10px">회차별 분석</div>
      <div class="analysis-wrap">
        <div class="chart-box"><div class="chart-title">점수 변화 추이</div><div class="chart-wrap"><canvas id="ch_${id}"></canvas></div></div>
        <div class="diff-boxes">
          <div class="chart-title" style="position:absolute;margin-top:-5px">회차별 전체 평균점수</div>
          <div style="display:flex;width:100%;gap:10px;margin-top:20px;">${diffBoxesHtml}</div>
        </div>
      </div>
      <div class="sec-title" style="margin-top:10px">개인별 약점 유형 Top 3</div>
      <div class="weak-wrap">${weakBoxesHtml}</div>
      ${typeGridHtml}
      <div style="margin-top:auto">
        <div class="sec-title" style="margin-top:10px">전체 인원 점수 분포</div>
        <div class="dist-wrap" style="margin-top:0">
          <div class="dist-header">${distHeaderHtml}</div>
          <table class="dist-table"><thead><tr><th>점수 구간</th>${s.rnds.map(r=>`<th>${r}차</th>`).join('')}</tr></thead><tbody>${distTableHtml}</tbody></table>
        </div>
      </div>
      <div style="text-align:right;font-size:9px;color:#aaa;margin-top:5px">생성일: ${today}</div>
    </div>`;
}

function srInitChart(s, id) {
  if (s.scores.length <= 1) return;
  const canvas = document.getElementById(`ch_${id}`);
  if (!canvas) return;
  if (srCharts[id]) srCharts[id].destroy();
  srCharts[id] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: s.rnds.map(r=>`${r}차`),
      datasets: [{ label:'점수', data:s.scores, spanGaps:true, borderColor:'#4A7CC7', backgroundColor:'rgba(74,124,199,0.1)', pointBackgroundColor:'#1B2E4B', pointRadius:4, tension:0.4, fill:true }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid:{color:'#E8EEF7'}, min:0, max:100, ticks:{font:{size:9},stepSize:20} },
        x: { grid:{display:false}, ticks:{font:{size:9}} }
      },
      plugins: { legend:{display:false} },
      layout: { padding:0 }
    }
  });
}

// ══════════════════════════════════════════════
// PNG 저장
// ══════════════════════════════════════════════
async function srSavePNG(id, name) {
  const card = document.getElementById(id);
  if (!card) { srToast('카드를 찾을 수 없습니다', true); return; }
  srToast('PNG 생성 중...');
  try {
    const canvas = await html2canvas(card, { scale:2, width:794, backgroundColor:'#fff', useCORS:true, logging:false });
    srDl(canvas, name);
    srToast(`${name}.png 저장 완료`);
  } catch(e) { srToast('PNG 오류: '+e.message, true); }
}

async function srSaveAllPNG() {
  const list = srCurrentList.length ? srCurrentList : srAnalysisResult;
  if (!list.length) { srToast('저장할 학생 없음', true); return; }
  srToast(`${list.length}명 PNG 생성 중...`);

  for (const s of list) {
    const id = ('card_'+(s.class||'c')+'_'+s.name).replace(/[^a-z0-9_]/gi,'_');
    let card = document.getElementById(id);
    let temp = null;

    if (!card) {
      temp = document.createElement('div');
      temp.style.cssText = 'position:absolute;left:-9999px;top:0';
      temp.innerHTML = srBuildCard(s, id);
      document.getElementById('panel-analysis').appendChild(temp);
      card = document.getElementById(id);
      await srTick(); srInitChart(s, id); await srTick(300);
    }
    try {
      const canvas = await html2canvas(card, { scale:2, width:794, backgroundColor:'#fff', useCORS:true, logging:false });
      srDl(canvas, s.name);
    } catch(e) { console.error(s.name, e); }
    if (temp) temp.remove();
    await srTick(300);
  }
  srToast(`${list.length}명 PNG 저장 완료`);
}

function srDl(canvas, name) {
  const a = document.createElement('a');
  a.download = name+'.png'; a.href = canvas.toDataURL('image/png'); a.click();
}

// ══════════════════════════════════════════════
// 유틸
// ══════════════════════════════════════════════
function srFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result.split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

let _srToastTimer;
function srToast(msg, isErr=false) {
  const el = document.getElementById('sr-toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'show' + (isErr ? ' err' : '');
  clearTimeout(_srToastTimer);
  _srToastTimer = setTimeout(()=>{ el.className=''; }, 3500);
}
