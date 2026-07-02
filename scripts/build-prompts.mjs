// 유형별 프롬프트 빌드 스크립트
// prompts/<type>/harness.md, instructions.md 를 읽어
// public/prompts-data.js (window.TYPE_PROMPTS = {...}) 를 생성한다.
//
// 실행: node scripts/build-prompts.mjs  (npm run build 시 prebuild로 자동 실행)
// 편집: 이 파일이 아니라 prompts/<type>/*.md 를 수정하세요.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROMPTS_DIR = join(ROOT, 'prompts');
// 보안: 프롬프트를 공개 정적 파일(public/prompts-data.js)로 굽지 않고,
// 로컬 JSON 시드로만 생성한다. 마스터가 앱에서 이 파일을 Firestore(shared/prompts)로 업로드 → 앱은 로그인 후 서버에서 로딩.
const OUT = join(ROOT, 'prompts-seed.json');

const FIELDS = { harness: 'harness.md', instructions: 'instructions.md' };

function readIf(path) {
  return existsSync(path) ? readFileSync(path, 'utf8').replace(/\s+$/, '') : '';
}

const data = {};
const types = readdirSync(PROMPTS_DIR).filter((name) => {
  const p = join(PROMPTS_DIR, name);
  return statSync(p).isDirectory();
});

for (const type of types) {
  const dir = join(PROMPTS_DIR, type);
  const entry = {};
  for (const [field, file] of Object.entries(FIELDS)) {
    const text = readIf(join(dir, file));
    if (text) entry[field] = text;
  }
  if (Object.keys(entry).length) data[type] = entry;
}

writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('[build-prompts] ' + Object.keys(data).length + '개 유형 → ' + OUT);
for (const t of Object.keys(data)) {
  console.log('  - ' + t + ': [' + Object.keys(data[t]).join(', ') + ']');
}
