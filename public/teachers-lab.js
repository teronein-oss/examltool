// ※ 코드를 변경하려면 아래 CODES 배열을 수정하세요
var CODES = ['seum2025', 'english01', 'goT2026', 'manager1', 'manager2', 'manager3', 'user1', 'master_andy'];
var MASTER_CODE = 'master_andy';

// 클라우드 동기화 대상 코드 — 이 코드로 로그인하면 Firebase와 연동되며, 
// 로컬 저장 공간 역시 seum2025 등 일반 사용자와 섞이지 않도록 완전히 독립된(격리된) 키를 씁니다.
var CLOUD_CODES = ['manager1', 'manager2', 'manager3', 'user1', 'master_andy'];

var COLORS = ['c1','c2','c3','c4','c5','c6','c7','c8','c9','ca','cb','cc','cd','ce','cf'];
var HEXES  = ['#c0392b','#2980b9','#27ae60','#8e44ad','#d35400','#16a085','#2c3e50','#7f8c8d','#e67e22','#1abc9c','#9b59b6','#34495e','#e74c3c','#3498db','#2ecc71'];

var EXPL = '\nEXPLANATION:\n[정답 근거]: 본문에서 정답의 근거가 되는 핵심 문장 또는 논리 설명\n[오답 분석]:\n② [이 선택지가 틀린 이유]\n③ [이 선택지가 틀린 이유]\n④ [이 선택지가 틀린 이유]\n⑤ [이 선택지가 틀린 이유]';

// ─── 서술형 전용 공통 카탈로그 (학교별 분리 없음) ───
var SEO_DEFAULT_TYPES = [
  { id:'seo_topic_1', name:'주제문 영작_1', seoRender:'topic',
    direction:'[서술형] 다음 글의 주제를 조건에 맞게 영어로 쓰시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 주제를 포괄하는 영어 문장(8~12단어)\n- 정답 문장의 핵심 단어 4~5개를 원형으로 WORD_BANK에 제시\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[출제용 영어 지문]\nDIRECTION:\n다음 글의 주제를 <조건>에 맞게 영어로 쓰시오. [5.0점]\nCONDITIONS:\no <보기> 단어를 모두 사용할 것 (어형 변화 가능)\no 필요한 단어를 추가하여 ( )단어의 완전한 문장으로 쓸 것\nWORD_BANK:\n[단어1, 단어2, 단어3, 단어4]\nMODEL_ANSWER:\n[모범 답안 영문장]\nEXPLANATION:\n[정답]: [모범 답안]\n[해설]: 지문 핵심 주제 및 사용된 어형 변화 설명\n[정답 문장 해석]:' },
  { id:'seo_topic_2', name:'주제문 영작_2', seoRender:'topic',
    direction:'[서술형] 다음 글의 주제를 조건에 맞게 영어로 쓰시오.',
    prompt:'주제문 영작_2 프롬프트를 직접 입력하세요.' },
  { id:'seo_blanks_1', name:'빈칸영작_1', seoRender:'blanks',
    direction:'[서술형] 다음 빈칸에 알맞은 말을 영어로 쓰시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문의 핵심 문장에 빈칸(____________________)을 만들어 출제\n- 조건에 맞는 단어/구를 본문에서 찾아 쓰는 형태\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[빈칸(____________________)이 포함된 영어 지문]\nDIRECTION:\n다음 글의 빈칸에 들어갈 말을 <조건>에 맞게 쓰시오. [4.0점]\nCONDITIONS:\no 본문에서 찾아 쓸 것\no ( )단어로 쓸 것\nMODEL_ANSWER:\n[정답 단어/구]\nEXPLANATION:\n[정답]: [답]\n[해설]: 빈칸에 해당 표현이 들어가는 문맥적 근거 설명\n[지문 관련 해석]:' },
  { id:'seo_blanks_2', name:'빈칸영작_2', seoRender:'blanks',
    direction:'[서술형] 다음 빈칸에 알맞은 말을 영어로 쓰시오.',
    prompt:'빈칸영작_2 프롬프트를 직접 입력하세요.' },
  { id:'seo_summary_2', name:'요약문 빈칸 2개', seoRender:'summary2',
    direction:'[서술형] 요약문의 빈칸 (A)(B)를 완성하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 논리를 담은 요약 영문장에 (A)(B) 빈칸 2개 설정\n- 본문 단어를 품사/어형 변형해야 정답이 되도록 출제\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 내용을 요약할 때, 빈칸 (A)(B)에 알맞은 말을 쓰시오. [각 2.0점]\nSUMMARY:\n[(A)(B) 빈칸이 포함된 요약 영문장]\nCONDITIONS:\no 본문 단어를 활용할 것 (품사·어형 변화 가능)\nMODEL_ANSWER:\n(A): [정답] (B): [정답]\nEXPLANATION:\n[정답]: (A) [답], (B) [답]\n[해설]: 각 빈칸의 정답이 본문에서 도출되는 근거 설명\n[요약문 전체 해석]:' },
  { id:'seo_summary_3', name:'요약문 빈칸 3개', seoRender:'summary3',
    direction:'[서술형] 요약문의 빈칸 (A)(B)(C)를 완성하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 논리를 담은 요약 영문장에 (A)(B)(C) 빈칸 3개 설정\n- 본문 단어를 품사/어형 변형해야 정답이 되도록 출제\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 요지를 주어진 <조건>에 맞게 완성하시오. [각 2.0점]\nSUMMARY:\n[(A)(B)(C) 빈칸이 포함된 요약 영문장]\nCONDITIONS:\no 본문 단어를 활용할 것 (품사·어형 변화 필수)\nMODEL_ANSWER:\n(A): [정답] (B): [정답] (C): [정답]\nEXPLANATION:\n[정답]: (A) [답], (B) [답], (C) [답]\n[해설]: 각 빈칸의 정답이 본문에서 도출되는 근거와 어형 변화 설명\n[요약문 전체 해석]:' },
  { id:'seo_content', name:'내용영작', seoRender:'content',
    direction:'[서술형] 다음 질문에 영어로 답하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 내용에 대한 영어 질문 1개 출제\n- 완전한 영어 문장으로 답하도록 유도\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n위 글을 읽고, 다음 질문에 완전한 영어 문장으로 답하시오. [5.0점]\n[Q]: [영어 질문]\nMODEL_ANSWER:\n[완전한 영어 문장 답변]\nEXPLANATION:\n[정답]: [답변]\n[해설]: 질문의 답이 본문 어디서 도출되었는지 설명\n[지문 관련 해석]:' },
  { id:'seo_topic_plus_content2', name:'내용 + 주제', seoRender:'topic_plus',
    direction:'[서술형] 주제문 영작 + 내용 문제 2개',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 동일 지문에서 서술형 문제 3개를 한 번에 출제\n- (1) 주제문 영작: 보기+조건 제시형\n- (2) 내용 문제1: 빈칸 또는 요약 형태\n- (3) 내용 문제2: 질문 답변 형태\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION_TOPIC:\n다음 글의 주제를 <조건>에 맞게 영어로 쓰시오. [5.0점]\nCONDITIONS_TOPIC:\no <보기> 단어를 모두 사용할 것 (어형 변화 가능)\nWORD_BANK:\n[단어1, 단어2, 단어3, 단어4]\nMODEL_ANSWER_TOPIC:\n[주제문 영작 모범 답안]\nDIRECTION_Q1:\n다음 글의 빈칸에 알맞은 말을 본문에서 찾아 쓰시오. [4.0점]\n[빈칸이 포함된 문장 또는 요약문]\nCONDITIONS_Q1:\no ( )단어로 쓸 것\nMODEL_ANSWER_Q1:\n[내용 문제1 정답]\nDIRECTION_Q2:\n위 글을 읽고, 다음 질문에 완전한 영어 문장으로 답하시오. [4.0점]\n[Q]: [영어 질문]\nMODEL_ANSWER_Q2:\n[내용 문제2 정답]\nEXPLANATION:\n[주제 정답]: [주제문]\n[내용1 정답]: [답1]\n[내용2 정답]: [답2]\n[해설]: 각 문제의 근거 및 어형 변화 설명\n[지문 전체 해석]:' },
  { id:'seo_grammar_1', name:'어법 서술형_1', seoRender:'grammar',
    direction:'[서술형] 어법상 틀린 부분을 찾아 바르게 고쳐 쓰시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 내 어법상 틀린 표현 1~2개를 선정하여 어법 오류 서술형 출제\n- 학생이 오류를 찾아 올바른 형태로 고쳐 쓰도록 유도\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[어법 오류가 포함된 영어 지문 (오류 부분에 밑줄 표시 ______)]\nDIRECTION:\n다음 글에서 어법상 틀린 부분을 <조건>에 맞게 찾아 고쳐 쓰시오. [5.0점]\nCONDITIONS:\no 틀린 표현 1개를 찾아 쓸 것\no 바르게 고친 표현도 함께 쓸 것\nMODEL_ANSWER:\n[틀린 표현] → [바른 표현]\nEXPLANATION:\n[정답]: [틀린 표현] → [바른 표현]\n[해설]: 해당 어법이 틀린 이유와 올바른 형태의 문법적 근거 설명\n[지문 관련 해석]:' },
  { id:'seo_grammar_2', name:'어법 서술형_2', seoRender:'grammar',
    direction:'[서술형] 어법상 틀린 부분을 찾아 바르게 고쳐 쓰시오.',
    prompt:'어법 서술형_2 프롬프트를 직접 입력하세요.' },
  { id:'seo_compose_1', name:'조건영작_1', seoRender:'compose',
    direction:'[서술형] 다음 우리말을 조건에 맞게 영작하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 핵심 내용과 연관된 한국어 문장 제시\n- 어휘/구조 조건을 포함하여 영작 유도\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 우리말을 주어진 <조건>에 맞게 영작하시오. [5.0점]\n[우리말]: [한국어 문장]\nCONDITIONS:\no [어휘 조건]\no [구조/어법 조건]\nMODEL_ANSWER:\n[모범 답안 영문장]\nEXPLANATION:\n[정답]: [모범 답안]\n[해설]: 주어진 조건이 충족된 문법적 근거 설명\n[우리말 해석 확인]:' },
  { id:'seo_compose_2', name:'조건영작_2', seoRender:'compose',
    direction:'[서술형] 다음 우리말을 조건에 맞게 영작하시오.',
    prompt:'조건영작_2 프롬프트를 직접 입력하세요.' },
  { id:'seo_ext_passage', name:'외부지문+추가제시문_DB2', seoRender:'ext_passage',
    direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'외부지문+추가제시문_DB2 프롬프트를 직접 입력하세요.' },
  { id:'seo_kor_content_add', name:'한글서술형_지문내용추가_DB2', seoRender:'kor_content_add',
    direction:'다음 글을 읽고 물음에 답하시오.',
    prompt:'한글서술형_지문내용추가_DB2 프롬프트를 직접 입력하세요.' },
  { id:'seo_tb_blank_content', name:'교과서 빈칸+내용_DB2', seoRender:'tb_blank_content',
    direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'교과서 빈칸+내용_DB2 프롬프트를 직접 입력하세요.\n\n## ★ 출력 절대 규칙\n아래 섹션 라벨을 반드시 순서대로 사용할 것 (표 사용 금지)\n\n## 출력 형식\nPASSAGE:\n[지문 (우리말 밑줄 문장 포함)]\nDIRECTION_A:\n(1) 윗글의 밑줄 친 우리말 해석을 바탕으로 <보기>에 주어진 단어를 한 번씩만 모두 사용하여 <조건>에 맞게 영어로 완성하시오.\nWORD_BANK:\n[단어1 / 단어2 / ...]\nCONDITIONS_A:\n필요시 단어를 변형할 것\nMODEL_ANSWER_A:\n[정답 문장]\nDIRECTION_B:\n(2) 다음 질문에 대한 답을 주어진 <조건>에 맞게 영어 문장으로 완성하시오.\nCONDITIONS_B:\n· 주어진 단어로 문장을 시작할 것\n· 본문의 내용을 근거로 작성할 것\nQUESTION_A:\n[첫 번째 질문 전체 텍스트]\nSTARTER_A:\n[Q1 답의 시작 단어/구, 예: It]\nQUESTION_B:\n[두 번째 질문 전체 텍스트]\nSTARTER_B:\n[Q2 답의 시작 단어/구, 예: It]\nMODEL_ANSWER_B:\n➀ [Q1 정답 문장]\n➁ [Q2 정답 문장]\nEXPLANATION:\n[해설]' },
  { id:'seo_tb_blank_write_bh', name:'교과서 빈칸 영작_BH', seoRender:'tb_blank_write_bh',
    direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'여기에 메타프롬프트를 붙여넣으세요.\n\n## ★ 출력 절대 규칙 (반드시 유지)\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n3. 마크다운 서식(**굵게**, ## 머리글, - 목록) 금지, 순수 텍스트로만 출력\n\n## 출력 형식\nPASSAGE:\n[지문]\nDIRECTION:\n다음 글을 읽고, 물음에 답하시오.\nWORD_BANK:\n[단어1 / 단어2 / ...]\nCONDITIONS:\n[조건]\nMODEL_ANSWER:\n[정답 문장]\nEXPLANATION:\n[해설]' },
  { id:'seo_summary_4_bh', name:'교과서 요약문 빈칸4개_BH', seoRender:'summary4',
    direction:'[서술형] 윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(D)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오.',
    prompt:'여기에 메타프롬프트를 붙여넣으세요.\n\n---\n\n## ★ 출력 절대 규칙 (반드시 유지)\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n3. 마크다운 서식(**굵게**, ## 머리글, - 목록) 금지, 순수 텍스트로만 출력\n\n## 출력 형식\nPASSAGE:\n[가공된 본문 — 220~260단어]\nDIRECTION:\n윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(D)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오.\nSUMMARY:\n[(A)(B)(C)(D) 빈칸이 포함된 요약문 — 60~80단어]\nMODEL_ANSWER:\n(A): [정답]\n(B): [정답]\n(C): [정답]\n(D): [정답]\nEXPLANATION:\n(A) 정답: [답] / 출처: [본문 문장] / 난이도: ★☆☆ / 출제 의도: [설명]\n(B) 정답: [답] / 출처: [본문 문장] / 난이도: ★★☆ / 출제 의도: [설명]\n(C) 정답: [답] / 출처: [본문 문장] / 난이도: ★★☆ / 출제 의도: [설명]\n(D) 정답: [답] / 출처: [본문 문장] / 난이도: ★★★ / 출제 의도: [설명]' },
  { id:'seo_content_blank_grammar_bh', name:'내용빈칸 + 어법_BH2', seoRender:'content_blank_grammar_bh',
    direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'당신은 한국 고등학교 영어 내신 서술형 문제 출제 전문가입니다.\n원문(영어 지문)을 입력받아 아래 규칙에 따라 변형 지문과 서술형 문항 2종을 생성합니다.\n\n===== 규칙 1: 지문 변형 =====\n\n목표 변형도(TARGET_TI): 8~12%\n변형도(TI) 계산:\n  LEX = (치환된 내용어 수 / 전체 내용어 수) × 100\n  SYN = (재구조화된 절 수 / 전체 절 수) × 100\n  STR = (분리·병합된 문장 수 / 전체 문장 수) × 100\n  TI  = 0.4×LEX + 0.45×SYN + 0.15×STR\n\n변형 원칙:\n- 원문을 최대한 보존한다. 동의어 치환이나 대량 개작 금지(LEX ≈ 0 유지).\n- 변형은 어법 채점 포인트에만 집중한다.\n- 허용 변형 유형: 전치사+관계대명사 조작 / 분사구문↔관계사절 전환 / 등위접속↔분사구문 전환 / 문장 분리·병합.\n- 변형 후 TI가 8~12% 범위를 벗어나면 SYN 변형 절 수로 조정한다.\n\n밑줄 설정:\n- 5개를 지문 전 영역(도입/중반/후반)에 고르게 배치한다.\n- ⓐⓑⓒⓓⓔ 기호로 표기한다.\n- 각 밑줄은 아래 어법 단원 풀에서 서로 다른 단원으로 배정한다(같은 단원 중복 금지).\n- 밑줄 중 정확히 1개만 어법상 틀리게 만든다. 나머지는 정문 유지 또는 정문 변형.\n\n어법 단원 풀 (매 세트 서로 다른 5개 선택):\n1.관계사 2.분사·분사구문 3.동명사vs to부정사 4.주어-동사 수일치 5.시제·시제일치\n6.태(능동↔수동) 7.병렬구조 8.가정법 9.도치 10.접속사vs전치사vs관계사\n11.대명사일치·재귀대명사 12.형용사vs부사 13.비교구문 14.강조구문 15.명사절 16.사역·지각동사\n\n오답 설계 원칙:\n- 오답은 규칙을 알아야만 잡히는 함정이어야 한다(명백히 어색한 비문 금지).\n- 나머지 4개 밑줄도 그럴듯해서 헷갈릴 수 있는 정문으로 구성해 오답 매력도를 분산시킨다.\n\n===== 규칙 2: 내용정리 표 빈칸 서술형 =====\n\n빈칸 수: 3개\n빈칸 배치 원칙:\n- 표의 각 행(범주) ↔ 지문의 특정 구간이 1:1 대응되도록 표를 설계한다.\n- 빈칸 1개는 Category열(범주어 추론형), 2개는 Description열(직접 retrieval형)으로 구성한다.\n- 정답은 지문에 그대로(또는 1단어 이내 변형으로) 존재해야 한다.\n- 정답은 1~2 단어 명사(구)로만 한정한다.\n- 빈칸 위치는 지문 도입·중반·후반에 분산시킨다.\n\n===== 규칙 3: 출력 포맷 =====\n\n아래 섹션 라벨을 반드시 순서대로 사용하고, 마크다운 서식 금지.\n\nTRANSFORMED_PASSAGE:\n(밑줄 ⓐ~ⓔ 포함 변형 지문 전문)\n\nTRANSFORM_REPORT:\nTI: <숫자>%  (LEX:<>% / SYN:<>% / STR:<>%)\nCHANGES:\n- <문장번호> | <원문 해당 부분> → <변형 부분> | <변형유형> | ERROR:Y/N\n\nQ1_DIRECTION:\n윗글의 내용을 표와 같이 정리하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 각각 1~2 단어로 쓰시오.\nQ1_TABLE:\nCategory | Description\n[범주1] | [설명1]\n(A) | [설명2]\n[범주3] | (B)\n[범주4] | (C)\nQ1_ANSWER:\n(A): <정답>\n(B): <정답>\n(C): <정답>\nQ1_INTENT:\n(A): <지문근거문장>\n(B): <지문근거문장>\n(C): <지문근거문장>\n\nQ2_DIRECTION:\n윗글의 밑줄 친 ⓐ~ⓔ 중 어법상 틀린 것을 골라 기호와 틀린 부분을 적고, 틀린 부분만을 바르게 고쳐 쓰시오.\nQ2_UNDERLINE_MAP:\nⓐ: [밑줄 어구] | 단원:[단원명] | 정오:[정문/오답]\nⓑ: [밑줄 어구] | 단원:[단원명] | 정오:[정문/오답]\nⓒ: [밑줄 어구] | 단원:[단원명] | 정오:[정문/오답]\nⓓ: [밑줄 어구] | 단원:[단원명] | 정오:[정문/오답]\nⓔ: [밑줄 어구] | 단원:[단원명] | 정오:[정문/오답]\nQ2_ANSWER:\n<기호> / <틀린부분> / <고친것>\nQ2_EXPLANATION:\n<오답 이유 + 핵심 규칙 1~2줄>\n\n---\n\n다음 원문을 바탕으로 서술형 문제 세트를 생성하시오.\n\nORIGINAL_PASSAGE:\n"""\n{{원문을 여기에 붙여넣기}}\n"""\n\nPARAMETERS:\nTARGET_TI: 8~12\nNUM_UNDERLINE: 5\nNUM_BLANK: 3\nGRAMMAR_FOCUS: 분산\nANSWER_SLOT: auto\nDIFFICULTY: 중' },
];

var DEFAULT_TYPES = [
  { id:'topic', name:'주제', direction:'다음 글의 주제로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 주제 추론 출제 매뉴얼]에 따라 고품질 주제 문항 1개를 제작하십시오.\n## 출제 매뉴얼\n- 정답은 지문을 관통하는 핵심 아이디어를 포괄하는 명사구로 작성\n- 오답은 지엽적 사실, 잘못된 초점, 반대 방향, 과도한 일반화 사용\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 주제로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 지문의 주제와 정답 선지가 연결되는 이유를 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'title', name:'제목', direction:'다음 글의 제목으로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 제목 추론 출제 매뉴얼]에 따라 고품질 제목 문항 1개를 제작하십시오.\n## 출제 매뉴얼\n- 정답은 핵심 요지를 함축적·비유적으로 표현한 Title Case\n- 오답은 과장, 태도 왜곡, 지엽적 사실 등 활용\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 제목으로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답이 본문 요지를 어떻게 비유적/함축적으로 담아냈는지 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'implication', name:'함의추론', direction:'다음 글의 밑줄 친 부분이 의미하는 바로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 21번 함축 의미 추론 문항 출제자입니다.\n## 출제 매뉴얼\n- 비유적/역설적으로 표현된 구를 밑줄로 선정하고, 직설적으로 패러프레이징한 선지를 정답으로 구성\n- 오답은 키워드 함정, 반대 논리 등 활용\n## ★ 출력 절대 규칙\n1. PASSAGE 내 밑줄 부분 표시\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nPASSAGE:\n[밑줄이 표시된 영어 지문]\nDIRECTION:\n밑줄 친 부분이 다음 글에서 의미하는 바로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 밑줄 친 표현의 함축적 의미와 정답 선지가 논리적으로 연결되는 이유 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'match', name:'내용 일치', direction:'다음 글의 내용과 일치하지 않는 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 내용 일치(True/False) 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문의 세부 내용을 바탕으로 한글 선택지 5개를 작성하십시오.\n- 4개는 지문 내용과 일치(True), 1개는 일치하지 않는(False) 내용으로 구성하여 정답을 만드시오.\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 내용과 일치하지 않는 것은?\nCHOICES:\n① [한글 선지]\n② [한글 선지]\n③ [한글 선지]\n④ [한글 선지]\n⑤ [한글 선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답 선지가 본문의 어떤 부분과 다른지 짧게 언급\n[선택지 해석]: (본문 문장과의 일치 여부 기술)\n① [1번 선지와 관련된 지문 문장/근거 짧게 요약]\n② [2번 선지와 관련된 지문 문장/근거 짧게 요약]\n③ [3번 선지와 관련된 지문 문장/근거 짧게 요약]\n④ [4번 선지와 관련된 지문 문장/근거 짧게 요약]\n⑤ [5번 선지와 관련된 지문 문장/근거 짧게 요약]' },

  { id:'grammar', name:'어법', direction:'다음 밑줄 친 부분 중, 어법상 틀린 것은?',
    prompt:'당신은 대한민국 수능 영어 영역 어법 문항 전문 출제자입니다.\n## 출제 매뉴얼\n- 동사/준동사, 분사, 병렬 구조, 대명사 일치 등 수능 빈출 어법 코드 적용\n- 5개의 밑줄 중 1개만 틀린 어법으로 교체하여 정답 설정\n## ★ 출력 절대 규칙\n1. 1문장 1선지 원칙 엄수 (한 문장에 밑줄 2개 이상 불가)\n2. PASSAGE 내 선지 단어 바로 앞에 ①~⑤ 직접 삽입\n3. 표(Table) 형태 사용 금지\n## 출력 형식\nTARGETS:\n(어법 요소 5개 나열. 정답은 \'[원본] -> [오류]\' 형식으로 표기)\nPASSAGE:\n[①②③④⑤ 번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답 선지가 어법상 틀린 이유와 올바른 형태를 간결하게 설명\n[선택지 해석]:\n① [1번 단어/구의 문법적 의미와 쓰임 간략 해석]\n② [2번 단어/구의 문법적 의미와 쓰임 간략 해석]\n③ [3번 단어/구의 문법적 의미와 쓰임 간략 해석]\n④ [4번 단어/구의 문법적 의미와 쓰임 간략 해석]\n⑤ [5번 단어/구의 문법적 의미와 쓰임 간략 해석]' },

  { id:'grammar_ab', name:'어법 선택형[a/b]', direction:'다음 (A), (B), (C)의 각 네모 안에서 어법에 맞는 표현으로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 어법 선택형 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문 내 어법 판단이 필요한 위치 3곳에 (A), (B), (C) 레이블을 붙이고, 각 위치에 [(a) 어법형태 / (b) 어법형태] 형식으로 두 가지 선택지를 삽입\n- 각 위치에서 문법적으로 올바른 형태 하나가 정답 (능동/수동, 단수/복수, 원형/분사, to부정사/동명사 등 수능 빈출 어법 코드 활용)\n- 선지는 (A)(B)(C)의 (a)/(b) 조합 5가지로 구성하며 정답 번호 랜덤 배치\n## ★ 출력 절대 규칙\n1. PASSAGE 내 [(a) 형태 / (b) 형태] 형식 엄수\n2. 표(Table) 형태 사용 금지\n3. PASSAGE에 한국어 해석 금지\n## 출력 형식\nPASSAGE:\n[지문 내 (A), (B), (C) 위치에 각각 [(a) 형태 / (b) 형태] 삽입된 영어 지문]\nDIRECTION:\n다음 (A), (B), (C)의 각 네모 안에서 어법에 맞는 표현으로 가장 적절한 것은?\nCHOICES:\n① (A) (a) (B) (a) (C) (a)\n② (A) (a) (B) (b) (C) (a)\n③ (A) (b) (B) (a) (C) (b)\n④ (A) (b) (B) (a) (C) (a)\n⑤ (A) (b) (B) (b) (C) (a)\nANSWER: [①~⑤ 중 정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: (A), (B), (C) 각 위치에서 선택된 어법 형태가 올바른 문법적 근거를 간결하게 설명\n[선택지 해석]:\n(A): (a) [표현] - [문법 설명] / (b) [표현] - [문법 설명]\n(B): (a) [표현] - [문법 설명] / (b) [표현] - [문법 설명]\n(C): (a) [표현] - [문법 설명] / (b) [표현] - [문법 설명]' },

  { id:'vocab', name:'어휘', direction:'다음 밑줄 친 단어의 쓰임이 적절하지 않은 것은?',
    prompt:'당신은 대한민국 수능 영어 최고난도 어휘 문항 출제자입니다.\n## 출제 매뉴얼\n- 글의 흐름을 보여주는 핵심 어휘 5개 중 1개를 문맥상 틀린 정반대 의미의 단어로 교체\n- 1문장 1선지 원칙 엄수\n## ★ 출력 절대 규칙\n1. PASSAGE 내 선지 단어 바로 앞에 ①~⑤ 삽입. 정답 번호 뒤엔 반드시 틀린 반의어가 와야 함\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nTARGETS:\n(어휘 5개 나열. 정답은 반의어로 표기)\nPASSAGE:\n[①②③④⑤ 번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 해당 단어가 문맥상 틀린 이유와 반의어로 교체되어야 하는 논리적 근거를 간결하게 설명\n[선택지 해석]:\n① [1번 단어의 의미 및 문맥 해석]\n② [2번 단어의 의미 및 문맥 해석]\n③ [3번 단어의 의미 및 문맥 해석]\n④ [4번 단어의 의미 및 문맥 해석]\n⑤ [5번 단어의 의미 및 문맥 해석]' },

  { id:'vocab_ab', name:'어휘 선택형[a/b]', direction:'다음 (A), (B), (C)의 각 네모 안에서 문맥에 맞는 낱말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 어휘 선택형 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문 내 핵심 어휘 위치 3곳에 (A), (B), (C) 레이블을 붙이고, 각 위치에 [(a) 단어 / (b) 단어] 형식으로 의미가 반대되는 두 단어를 삽입\n- 문맥상 자연스러운 단어 하나가 각 위치의 정답\n- 선지는 (A)(B)(C)의 (a)/(b) 조합 5가지로 구성하며 정답 번호를 랜덤 배치\n## ★ 출력 절대 규칙\n1. PASSAGE 내 [(a) 단어 / (b) 단어] 형식 엄수\n2. 표(Table) 형태 사용 금지\n3. PASSAGE에 한국어 해석 금지\n## 출력 형식\nPASSAGE:\n[지문 내 (A), (B), (C) 위치에 각각 [(a) 단어 / (b) 단어] 삽입된 영어 지문]\nDIRECTION:\n다음 (A), (B), (C)의 각 네모 안에서 문맥에 맞는 낱말로 가장 적절한 것은?\nCHOICES:\n① (A) (a) (B) (a) (C) (a)\n② (A) (a) (B) (b) (C) (a)\n③ (A) (b) (B) (a) (C) (b)\n④ (A) (b) (B) (a) (C) (a)\n⑤ (A) (b) (B) (b) (C) (a)\nANSWER: [①~⑤ 중 정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: (A), (B), (C) 각 위치에서 선택된 단어가 문맥상 적절한 이유를 간결하게 설명\n[선택지 해석]:\n(A): (a) [단어] - [뜻] / (b) [단어] - [뜻]\n(B): (a) [단어] - [뜻] / (b) [단어] - [뜻]\n(C): (a) [단어] - [뜻] / (b) [단어] - [뜻]' },

  { id:'reference', name:'지칭추론', direction:'밑줄 친 ①~⑤ 중에서 가리키는 대상이 나머지 넷과 다른 것은?',
    prompt:'당신은 대한민국 수능 영어 지칭추론 문항 출제자입니다.\n## 출제 매뉴얼\n- 두 명 이상의 인물이 등장하는 스토리 지문을 사용 또는 구성\n- 지문 내 대명사(he, she, his, her, him, they 등) 또는 지칭 표현 5개를 선정하여 ①~⑤로 표시\n- 5개 중 4개는 동일 인물(주인공)을 가리키고, 1개만 다른 인물을 가리키도록 구성\n- 정답 번호는 ①~⑤ 중 랜덤하게 설정\n## ★ 출력 절대 규칙\n1. PASSAGE 내 지칭 표현 바로 앞에 ①~⑤ 직접 삽입\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nTARGETS:\n(지칭 표현 5개 나열. 각 번호가 가리키는 인물 명시. 정답 번호 표시)\nPASSAGE:\n[①②③④⑤ 번호가 삽입된 전체 영어 지문]\nDIRECTION:\n밑줄 친 ①~⑤ 중에서 가리키는 대상이 나머지 넷과 다른 것은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 각 번호가 가리키는 대상을 분석하고, 정답 번호만 다른 인물을 가리키는 이유를 설명\n[선택지 해석]:\n① [①이 가리키는 인물 및 해당 문맥 해석]\n② [②이 가리키는 인물 및 해당 문맥 해석]\n③ [③이 가리키는 인물 및 해당 문맥 해석]\n④ [④이 가리키는 인물 및 해당 문맥 해석]\n⑤ [⑤이 가리키는 인물 및 해당 문맥 해석]' },

  { id:'blank', name:'빈칸추론', direction:'다음 빈칸에 들어갈 말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 빈칸 추론 출제 매뉴얼]에 따라 고품질 빈칸 추론 문항 1개를 제작하십시오.\n## 수능 빈칸 추론 출제 매뉴얼\n### 1. 빈칸 위치 및 출제 의도\n- 지문의 핵심 주제(Main Idea) 또는 논리적 귀결을 보여주는 결론부 문장에 빈칸을 설정\n- 빈칸은 ____________________ 로 표시\n### 2. 정답/오답 선지 구성 원리\n- 명시된 표현 그대로 사용 금지, 동의어/추상적 개념으로 Paraphrasing\n- 오답은 키워드 함정, 반대 방향, 논리적 비약, 부분적 사실 기법 사용\n### 3. 정답 번호 배치 규칙 ★\n- ①~⑤ 중 매 문항마다 다른 번호를 랜덤하게 정답으로 설정할 것\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외의 내용은 절대 출력 불가\n2. PASSAGE에는 영어 지문만 출력 (한국어 해석 일체 금지)\n3. 표(Table) 형태 사용 금지, 텍스트로만 해설 작성\n## 출력 형식\nPASSAGE:\n[빈칸이 포함된 출제용 영어 지문]\nDIRECTION:\n다음 빈칸에 들어갈 말로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [①~⑤ 중 정답 번호 하나]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 빈칸에 들어갈 내용과 정답 선지의 논리적 근거를 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'blank_hard', name:'빈칸 고난이도', direction:'다음 빈칸에 들어갈 말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 빈칸 추론 최고난도 문항 출제자입니다.\n아래 [최고난도 빈칸 출제 매뉴얼]에 따라 문항 1개를 제작하십시오.\n## 최고난도 빈칸 출제 매뉴얼\n### 1. 빈칸 설정 원칙\n- 지문의 핵심 주제를 추상적·함축적으로 표현한 구(Phrase) 단위에 빈칸 설정\n- 단어 하나로 답할 수 없는 구 수준의 빈칸을 설계하며, 빈칸은 ____________________ 로 표시\n### 2. 고난도 오답 구성 원칙\n- 지문 표면 어휘를 활용한 키워드 함정 오답\n- 정답 논리와 정반대 방향 오답\n- 지문에서 추론 불가한 논리적 비약 오답\n- 지문 일부는 맞으나 핵심 논리와 어긋나는 부분 사실 오답\n### 3. 정답 번호 배치 규칙 ★\n- ①~⑤ 중 매 문항마다 다른 번호를 랜덤하게 정답으로 설정할 것\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외의 내용은 절대 출력 불가\n2. PASSAGE에는 영어 지문만 출력 (한국어 해석 일체 금지)\n3. 표(Table) 형태 사용 금지\n## 출력 형식\nPASSAGE:\n[빈칸(구 단위)이 포함된 고난도 출제용 영어 지문]\nDIRECTION:\n다음 빈칸에 들어갈 말로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [①~⑤ 중 정답 번호 하나]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 빈칸에 해당 구(Phrase)가 들어가야 하는 논리적 근거와 각 오답이 틀린 이유를 구체적으로 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'irrelevant', name:'무관한 문장', direction:'다음 글에서 전체 흐름과 관계 없는 문장은?',
    prompt:'당신은 대한민국 수능 영어 무관한 문장 찾기 문항 출제자입니다.\n## 출제 매뉴얼\n- 핵심 소재나 앞 문장 키워드를 재사용하되, 주체/대상을 바꾸거나 방향을 뒤집어 논점을 이탈하는 문장 1개를 중간에 추가\n## ★ 출력 절대 규칙\n1. 도입부 이후 ①~⑤ 번호를 각 문장 앞에 직접 표시\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nPASSAGE:\n[번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글에서 전체 흐름과 관계 없는 문장은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 해당 문장이 글의 전체 흐름에서 어떻게 벗어나는지 간결하게 설명\n[선택지 해석]:\n① [1번 문장 간략 해석]\n② [2번 문장 간략 해석]\n③ [3번 문장 간략 해석]\n④ [4번 문장 간략 해석]\n⑤ [5번 문장 간략 해석]' },

  { id:'order', name:'문장 순서', direction:'주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n지문을 주어진 글(INTRO)과 (A), (B), (C) 세 단락으로 분할하십시오.\n## 출제 매뉴얼\n- 접속사보다는 내용 흐름, 대명사, 지시어, 관사 등을 이용해 순서를 추론하도록 출제\n- 선택지는 수능형 5개 고정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. 블록 내 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nINTRO:\n[주어진 글 (영어만)]\nBLOCK_A:\n(A) [A단락]\nBLOCK_B:\n(B) [B단락]\nBLOCK_C:\n(C) [C단락]\nDIRECTION:\n주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?\nCHOICES:\n① (A)-(C)-(B)\n② (B)-(A)-(C)\n③ (B)-(C)-(A)\n④ (C)-(A)-(B)\n⑤ (C)-(B)-(A)\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 지시어, 대명사, 내용 흐름상 해당 순서가 맞는 이유를 간결하게 설명\n[선택지 해석]:\n① (A)-(C)-(B) 연결 시의 논리적 흐름 간략 해석\n② (B)-(A)-(C) 연결 시의 논리적 흐름 간략 해석\n③ (B)-(C)-(A) 연결 시의 논리적 흐름 간략 해석\n④ (C)-(A)-(B) 연결 시의 논리적 흐름 간략 해석\n⑤ (C)-(B)-(A) 연결 시의 논리적 흐름 간략 해석' },

  { id:'insert', name:'문장 삽입', direction:'글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n## 출제 매뉴얼\n- 논리적 단절이 생기거나 지시어/대명사가 가리킬 대상이 사라지는 곳에 삽입 위치 설정\n- 문장이 빠진 자리에 ①②③④⑤ 번호 삽입\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. 영어 지문 내 한국어 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nGIVEN_SENTENCE:\n[삽입할 영어 문장]\nPASSAGE:\n[①②③④⑤ 번호가 포함된 전체 영어 지문]\nDIRECTION:\n글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 주어진 문장이 해당 위치에 들어가야 논리적 단절이나 지시어 모순이 해결되는 이유를 간결하게 설명\n[선택지 해석]:\n① [1번 위치 앞뒤 문맥 간략 해석]\n② [2번 위치 앞뒤 문맥 간략 해석]\n③ [3번 위치 앞뒤 문맥 간략 해석]\n④ [4번 위치 앞뒤 문맥 간략 해석]\n⑤ [5번 위치 앞뒤 문맥 간략 해석]' },

  { id:'summary', name:'요약문', direction:'다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 요약문 완성 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문 요약 문장 작성 및 (A), (B) 두 빈칸 생성\n- 정답을 포함한 5개 선지(①~⑤)를 생성\n## ★ 출력 절대 규칙\n1. 표(Table) 형태 사용 금지\n2. PASSAGE 및 SUMMARY에 한국어 해석 일체 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nSUMMARY:\n[빈칸 (A), (B)가 포함된 요약 문장]\nDIRECTION:\n다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?\nCHOICES:\n① (A) ___ (B) ___\n② (A) ___ (B) ___\n③ (A) ___ (B) ___\n④ (A) ___ (B) ___\n⑤ (A) ___ (B) ___\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 요약문의 (A), (B) 빈칸에 해당 단어쌍이 들어가야 하는 핵심 근거를 간결하게 설명\n[선택지 해석]:\n① (A) [단어 뜻] / (B) [단어 뜻]\n② (A) [단어 뜻] / (B) [단어 뜻]\n③ (A) [단어 뜻] / (B) [단어 뜻]\n④ (A) [단어 뜻] / (B) [단어 뜻]\n⑤ (A) [단어 뜻] / (B) [단어 뜻]' },

  { id:'order_match', name:'청덕2_순서+내용일치', direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'You are an expert Korean high school English exam question designer specializing in CSAT and internal school exam formats.\n\nTransform the given passage into a 2-question set: 순서배열 + 내용일치.\n\n## MODULE 1: PASSAGE TRANSFORMATION\n\nSTEP 1 — CONTENT EXPANSION\n- Expand the original passage by approximately 25~40%.\n- Add one cohesive paragraph introducing ONE of: (a) evolutionary/historical background, (b) contrasting case or statistical elaboration, (c) cause→effect mechanism supporting the main claim.\n- Match vocabulary tier to source passage. Include at least one participial phrase or embedded relative clause, and one cause-result connector (e.g., "due to", "likely because", "which is why").\n- Place the added paragraph so it creates an attractive but incorrect ordering temptation.\n\nSTEP 2 — SEGMENTATION\n- Label segments (A)(B)(C)(D). (A) = opening anchor (given, not reordered). (B)(C)(D) = to be reordered.\n- Each segment: 2~5 sentences. (A) must end with a stated assumption OR an open problem.\n\n## MODULE 2: 순서배열 DESIGN\n\nSTEP 3 — CONNECTOR DIVERSITY RULE\n- Across (A→B), (B→C), (C→D): use at least 2 different connector types.\n  TYPE 1: connective word (However / Furthermore / Therefore)\n  TYPE 2: referring expression (this, these, such + noun)\n  TYPE 3: topical/content chain (no explicit marker; concept progression)\n- At least one adjacent pair MUST use TYPE 3.\n\nSTEP 4 — DISTRACTORS: ensure at least one wrong option places the primary distractor segment first after (A).\n\n## MODULE 3: 내용일치 DESIGN\n\nSTEP 5 — OPTION CONSTRUCTION\n- 4 correct options (일치): use Paraphrase+abstraction / Synonym substitution / Structural inversion / Scope generalization — one type each, no repeats.\n- 1 incorrect option (불일치) = THE ANSWER: use one of NUMERICAL INVERSION / CAUSAL REVERSAL / SCOPE DISTORTION / DETAIL TRANSPLANT / NEGATION INSERTION.\n- Incorrect option: surface-plausible, length within ±20% of others, placed at ③ or ④.\n- Score: [3점] or [3.5점]\n\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n3. 마크다운 서식 금지, 순수 텍스트로만 출력\n4. BLOCK_A~BLOCK_D 내부에 한국어 절대 금지\n\n## 출력 형식\nBLOCK_A:\n(A)\n[segment A 영어 지문]\nBLOCK_B:\n(B)\n[segment B 영어 지문]\nBLOCK_C:\n(C)\n[segment C 영어 지문]\nBLOCK_D:\n(D)\n[segment D 영어 지문]\nORDER_DIRECTION:\n주어진 글 (A)에 이어질 내용을 순서에 맞게 배열한 것으로 가장 적절한 것은?\nORDER_CHOICES:\n① (B)-(C)-(D)\n② (B)-(D)-(C)\n③ (C)-(B)-(D)\n④ (C)-(D)-(B)\n⑤ (D)-(B)-(C)\nORDER_ANSWER: [정답 번호]\nMATCH_DIRECTION:\n윗글에 관한 내용으로 적절하지 않은 것은? [3점]\nMATCH_CHOICES:\n① [한글 선지]\n② [한글 선지]\n③ [한글 선지]\n④ [한글 선지]\n⑤ [한글 선지]\nMATCH_ANSWER: [정답 번호]\nEXPLANATION:\n[순서 정답]: [번호]\n[순서 해설]: A→B, B→C, C→D 연결 근거 (connector type 포함)\n[내용일치 정답]: [번호]\n[내용일치 해설]: 오답 선지가 지문 어느 부분과 다른지 설명\n[오답 전략]: [사용한 strategy 명]\n[오답 위치]: [③ or ④]\n[선지 해석]:\n① [해석]\n② [해석]\n③ [해석]\n④ [해석]\n⑤ [해석]' },
  { id:'content_grammar', name:'청덕2_내용일치+어법', direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'# 메타프롬프트 v1 — 원문 변형 출제 (내용일치 + 어법 선택)\n\n너는 한국 수능·고교 내신 영어 변형 출제 전문가다. 주어진 영어 원문을 격식 있는 학술 산문으로 확장·재진술하여 변형 지문을 만들고, 그 위에 ① 내용일치 문제 1개 ② 어법 선택 문제 1개를 출제한다. 아래 출제 원리를 반드시 준수한다.\n\n## STEP 1. 지문 변형 (TRANSFORM)\n\n원문을 1.3~1.5배 길이로 확장한다. 최종 지문은 200~250단어 이내로 제한한다. 세 가지 변형 유형을 모두 사용한다.\n\n(가) 격식화 패러프레이징 — 원문 문장은 유지하되 어휘·통사를 상향\n- 구어 접속사/부사 → 격식 연결어 (But → However, in reality / So → Consequently)\n- 구체·구어 어휘 → 추상·격식 어휘 (cheap → relatively inexpensive, a teenager → a single worker)\n- 단순 동사구 → 격식 동사구 (assume drops → reasonably expect to decrease substantially)\n- 전치사·관사 미세 교체 (to space → into space)\n\n(나) 내용 추가 — 원문에 없던 정보를 간결하게 삽입 (전체 분량의 25~35%, 단어 수 제한 엄수)\n- 중간 보완 문장 1~2개 (원문 논점을 뒷받침하는 인과/메커니즘 설명, 50단어 이내)\n- 대조 연결 문장 1개 (In contrast, ~)\n- 결론 문장 1개 (When all these factors are taken into account, ~)\n- ★ 도입 topic sentence 또는 세부 열거 확장은 단어 수 초과 시 생략\n\n(다) 어휘 교체(재진술) — 핵심 명사 1~2개를 동의·상위어로 교체하고, 필요 시 주석(*) 단어도 함께 교체\n\n[중요] 어법 출제 지점 사전 확보: 변형 시 어법 빈칸 3개 중 최소 2개를 "추가된 문장(나)" 안에 자연스럽게 배치할 수 있도록 문장을 설계한다.\n\n## STEP 2. 내용일치 문제 (CONTENT-MATCH)\n\n선지 5개. 정답 1 + 오답 4.\n\n정답 선지 구성원리\n- 근거 문장은 가급적 STEP 1에서 추가/일반화한 문장에서 가져온다 (원문에 직접 없던 일반화).\n- 본문 평서문을 추상명사·격식 어휘로 패러프레이즈 (easy to maintain → impose relatively limited maintenance burdens / on Earth → terrestrial environments).\n- 본문 표현을 그대로 베끼지 말 것.\n\n오답 4개 구성원리 — 아래 4유형을 1개씩 사용\n1. 정반대 진술(역): 본문 명제의 방향을 뒤집음 + 그럴듯한 위장 어휘(in the foreseeable future 등) 부착\n2. 결론 반대: 본문 최종 결론과 모순\n3. 인과 왜곡: 본문이 양보절(even if)로 처리한 내용을 긍정 인과/가속으로 뒤집음 → 가장 매력적인 오답으로 배치 (본문에 실제 등장한 키워드 사용)\n4. 주체/대상 왜곡: 행위 주체나 장소를 뒤바꿈. 혼동 유발 어휘 사용\n\n선지 형식 통제 (단서 노출 방지)\n- 5개 선지 모두 15~22단어, 길이 편차 최소화\n- 모두 동일 통사 구조 (주어 + 동사 + 추상 보어)\n- 추상명사·격식 어휘 균일 사용\n- 정답이 어휘·길이로 튀지 않게 오답과 동일 레지스터 유지\n\n## STEP 3. 어법 선택 문제 (GRAMMAR-CHOICE)\n\n빈칸 3개 (A)(B)(C). 각 빈칸에 [정답 / 오답] 두 선택지 제시.\n\n[핵심] 단원이 아니라 "수준"을 고정한다.\n세 빈칸 모두 어휘 의미가 아닌 "문장 구조 파악"으로 푸는 中~中상 난이도 어법이어야 한다. 아래 풀에서 서로 다른 3개 논리를 선택 (매번 동일 조합 금지).\n\n판단 논리 풀 (모두 구조 파악형):\n- 관계사: 관계부사 vs 관계대명사 (where/which) — 뒤 절의 완전성 + 선행사\n- 관계대명사 vs 접속사: that/what, that/which\n- 분사 vs 정동사 (using/use) — 이미 완전한 절 → 새 정동사 불가\n- 형용사 vs 부사 (inevitable/inevitably) — 수식 대상 식별, 인접 명사 함정\n- 주어-동사 수일치 (results/result) — 멀리 떨어진 진짜 주어 식별\n- 병렬구조 (converted/converting)\n- 태: 능동 vs 수동 (exposed/exposing)\n- to부정사 vs 동명사\n- 대명사 수일치\n\n난이도 보정 규칙\n- 정답과 오답 형태가 시각적으로 유사해야 함 (inevitable/inevitably, use/using)\n- 각 빈칸 옆에 함정 요소 1개 배치\n- 3개 중 1개는 中, 2개는 中상 난이도로 구성\n\n오답 선지 5지선다 조합 구성 (수능형)\n- (A)(B)(C) 정답 조합 외에 4개 오답 조합을 만들되, 각 오답 조합이 빈칸 중 1~2개만 틀리도록 분산 (한 빈칸만으로 정답이 결정되지 않게)\n\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n3. 마크다운 서식 금지, 순수 텍스트로만 출력\n4. TRANSFORMED_PASSAGE 내부 어법 빈칸은 (A) [정답 / 오답] 형식으로 표기 (슬래시 양쪽에 반드시 공백)\n5. GRAMMAR_CHOICES 첫 줄은 반드시 (A) - (B) - (C) 헤더로 시작, 이후 선지는 단어만 대시(-)로 연결\n6. ★ 지문 길이 절대 규칙: TRANSFORMED_PASSAGE는 반드시 200~220단어 사이를 유지할 것. 220단어 초과 시 내용 추가 항목을 줄여 재작성할 것. 200단어 미만도 허용 불가.\n\n## 출력 형식\nTRANSFORMED_PASSAGE:\n[변형된 지문. 어법 빈칸은 (A) [정답 / 오답] 형식으로 표기]\n* [주석 단어: 뜻]\nTRANSFORM_REPORT:\n- 격식화: [원문구] → [변형구] (변형수준)\n- 내용추가: [추가 문장/단락 요약]\n- 어휘교체: [원문어휘] → [변형어휘]\n- 어법지점배치: (A)=[추가문장/패러프레이즈문장], (B)=..., (C)=...\nCONTENT_MATCH_DIRECTION:\n윗글의 내용과 일치하는 것은?\nCONTENT_MATCH_CHOICES:\n① [오답: 유형=정반대]\n② [오답: 유형=결론반대]\n③ [오답: 유형=인과왜곡]\n④ [오답: 유형=주체왜곡]\n⑤ [정답]\nCONTENT_MATCH_ANSWER: [번호]\nGRAMMAR_DIRECTION:\n윗글의 각 괄호 안에서 어법상 맞는 것을 짝지은 것은?\nGRAMMAR_CHOICES:\n(A) - (B) - (C)\n① [A선택지] - [B선택지] - [C선택지]\n② [A선택지] - [B선택지] - [C선택지]\n③ [A선택지] - [B선택지] - [C선택지]\n④ [A선택지] - [B선택지] - [C선택지]\n⑤ [A선택지] - [B선택지] - [C선택지]\nGRAMMAR_ANSWER: [번호]\nEXPLANATION:\n[내용일치 정답]: [번호]\n[정답근거]: "[본문 근거 문장]" → 패러프레이즈 설명\n[오답해설]: ①~④ 각 1줄 (어느 본문 명제를 어떻게 비틀었는지)\n[어법 정답]: [번호]\n[판단논리]: (A)=[논리명: 1줄 근거] / (B)=... / (C)=...\n[난이도]: (A)=中상 (B)=中 (C)=中상\n[함정요소]: (A)=... (B)=... (C)=...' },
  { id:'ref_title', name:'청덕2_지칭추론+제목', direction:'다음 글을 읽고, 물음에 답하시오.',
    prompt:'너는 한국 수능·고교 내신 영어 변형 출제 전문가다. 주어진 원문을 학술 설명문으로 재구성·확장하여 변형 지문을 만들고, 그 위에 ① 밑줄 지칭 추론 문제 ② 제목 문제를 출제한다. 아래 원리를 반드시 준수한다.\n\n## STEP 1. 지문 변형 (TRANSFORM)\n\n길이 제약: 변형 지문은 반드시 200~230단어. 230단어를 넘기지 말 것. 200단어 미만 금지.\n수준 제약: 어휘·구문 난이도를 수능 변형 지문 수준으로 유지 — 추상명사·복문·관계절을 적극 사용하되, 1문장이 60단어를 넘지 않게.\n\n재구성 규칙:\n1. 첫 문장에서 핵심 추상개념을 명사로 정의한다. (예: X is our inclination to ~) — 이 명사가 지칭 추론의 주제어가 된다.\n2. 원문의 대화체·수사의문문·예시는 평서형 설명문으로 변환한다.\n3. 추가 문장 4~6개를 삽입해 분량을 확보한다. 구성:\n   - 메커니즘/정의 보강 1문장\n   - 부정적 결과 + 구체 일상 예시 1문장 (신용카드 과소비, 금요일 과음 등)\n   - From another angle, ~ 전환 1문장\n   - 구체적 사례 단락 1~2문장 — 여기에 두 번째 구체명사(money/투자금 등)를 반드시 등장시킨다 (지칭 함정용)\n4. 원문에서 인상적인 1문장은 거의 그대로 차용해 원본 흔적을 남긴다.\n5. 필요 시 주석(*) 단어 1~2개 지정.\n\n## STEP 2. 지칭 추론 문제 (REFERENCE-INFERENCE)\n\n밑줄 5개 (a)~(e). 4개 동일 지시 + 1개 이질 지시.\n\n대명사 변환·배치 원리:\n1. 모든 밑줄은 동일한 형태의 대명사여야 한다 (전부 it/It, 또는 전부 they/them 등). 형태로 구별 불가, 의미로만 판단되게 한다.\n2. (a)~(e) 중 4개는 STEP 1의 핵심 주제어(첫 문장 명사)를 가리키도록 배치한다.\n3. 이질 지시 1개는 두 번째 구체명사(예: money)를 가리키게 한다. 같은 대명사 형태를 쓰되, 문맥상 다른 대상임이 드러나게 한다.\n4. 이질 지시의 위치는 (a)~(e) 중 무작위 배치 — 항상 마지막에 두지 말 것.\n5. 비지칭 it(가주어 It is wise to ~ 등)은 밑줄 대상에서 제외한다.\n\n★ 정답 위치 규칙: 이질 지시의 위치를 매 문항마다 반드시 다르게 설정. (a)~(e) 중 랜덤 배치.\n\n## STEP 3. 제목 문제 (TITLE)\n\n선지 5개. 모두 5~8단어 명사구 제목, 길이·레지스터 균일. 일부 선지에 콜론(:) 부제 구조 사용.\n\n★ 정답 위치 규칙: 정답 선지의 번호(①②③④⑤)를 매 문항마다 반드시 다르게 설정. ①~⑤ 중 랜덤 배치.\n\n정답 구성원리:\n- 핵심 키워드(주제어) + 핵심 결과/논지를 직결한 명사구.\n- 본문 표현을 그대로 베끼지 말고 패러프레이즈 (inconsistent decisions → Hindering Consistent Decisions).\n\n오답 4개 구성원리 — 아래 4유형을 1개씩 사용:\n1. 범위 오류: 본문에 없는 내용 추가 (대처법/방법론 Various Ways to Deal 등)\n2. 주석·지엽 함정: 주석(*) 단어나 지엽적 용어를 핵심처럼 위장\n3. 어휘 왜곡: 본문 실재 어구를 비슷하지만 다른 뜻으로 변형\n4. 논조 반대: 본문이 부정적으로 본 대상을 긍정적으로 포장\n\n선지 형식 통제:\n- 5개 모두 명사구, 5~8단어, 길이 편차 최소화\n- 정답이 길이·어휘로 튀지 않게 오답과 동일 레지스터 유지\n\n## ★ 출력 절대 규칙\n1. 아래 섹션 라벨을 반드시 순서대로 사용할 것\n2. 표(Table) 사용 금지\n3. 마크다운 서식 금지, 순수 텍스트로만 출력\n4. TRANSFORMED_PASSAGE 내 밑줄은 (a)~(e) 형태로 표기 (예: (a) it, (b) it)\n5. ★ 지문 길이: 반드시 200~230단어. 초과·미달 모두 금지.\n6. ★ TITLE_CHOICES 선지에 [정답], [오답], [유형명] 등 메타 태그를 절대 포함하지 말 것. 선지는 순수 영어 명사구만 출력.\n\n## 출력 형식\nTRANSFORMED_PASSAGE:\n[변형된 지문. 밑줄은 (a)~(e)로 표기]\n* [주석 단어: 뜻]\nREF_DIRECTION:\n밑줄 친 (a)~(e) 중에서 가리키는 대상이 나머지 넷과 다른 것은?\nREF_ANSWER: [①~⑤ 중 이질 지시 위치 번호 — 매번 다르게]\nTITLE_DIRECTION:\n윗글의 제목으로 가장 적절한 것은?\nTITLE_CHOICES:\n① [영어 명사구 — 태그 없이 순수 텍스트]\n② [영어 명사구]\n③ [영어 명사구]\n④ [영어 명사구]\n⑤ [영어 명사구]\nTITLE_ANSWER: [①~⑤ 중 정답 번호 — 매번 다르게]\nEXPLANATION:\n[지칭추론 정답]: [번호]\n[지칭추론 해설]: 4개는 [주제어], 정답 [번호]는 [함정명사] 지시\n[제목 정답]: [번호]\n[정답근거]: [본문 근거 문장] → 패러프레이즈 설명\n[선택지해석]:\n① [①번 선지 한국어 번역]\n② [②번 선지 한국어 번역]\n③ [③번 선지 한국어 번역]\n④ [④번 선지 한국어 번역]\n⑤ [⑤번 선지 한국어 번역]' },
  { id:'connector', name:'연결사 빈칸', direction:'다음 글의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은? [3점]',
    prompt:'# 수능 영어 연결사 빈칸 문제 생성기 (메타프롬프트)\n\n## 역할\n너는 수능 영어 출제 전문가다. 주어진 영어 지문을 분석하여 수능 스타일의 연결사 빈칸 문제 [(A), (B) 유형]를 생성한다.\n\n---\n\n## 입력\n- 영어 지문 1개 (원문)\n\n---\n\n## STEP 1: 지문 변형 (목표 변형률: 40~55%)\n\n아래 변형 기법을 혼합하여 원문 대비 40~55% 수준으로 지문을 변형한다.\n\n### 변형 기법 목록\n1. **어휘 교체**: 동의어/유의어로 대체 (고2~3 수준 어휘 유지)\n2. **문장 구조 변경**: 능동↔수동, 긍정↔부정 표현 전환\n3. **문장 압축**: 2~3문장을 1문장으로 통합\n4. **문장 삭제**: 유머, 비유, 부연 설명 중 핵심 논리와 직결되지 않는 부분 제거\n5. **부연 추가**: 기존 문장에 분사구문/관계절로 설명 덧붙이기\n6. **연결사 빈칸 삽입**: 논리 전환점 2곳을 선정하여 연결사를 제거하고 (A), (B) 빈칸으로 교체\n\n---\n\n## STEP 2: 빈칸 위치 선정 원리\n\n### (A) 선정 기준\n- 앞 문장과 뒤 문장 사이에 **명확한 논리 전환**이 발생하는 지점\n- 가능한 논리 관계 유형:\n  - 대조 (contrast): 앞 내용과 반대되는 내용이 이어질 때\n  - 예시 도입 (exemplification): 앞의 주장을 구체화하는 예시가 이어질 때\n  - 부연/강조 (elaboration): 앞 내용을 더 구체적으로 설명할 때\n\n### (B) 선정 기준\n- 앞에서 제시된 **원리/이론**이 **실천적 결론이나 적용**으로 이어지는 지점\n- 가능한 논리 관계 유형:\n  - 결과/따라서 (result/conclusion): 앞 내용의 논리적 귀결\n  - 요약 (summary): 앞 내용을 정리하며 다음 행동을 도출\n  - 추가 (addition): 앞 내용에 보완적 정보가 이어질 때\n\n---\n\n## STEP 3: 연결사 선택 원칙\n\n### 핵심 원칙\n- 해당 기출 문제에 사용된 특정 연결사를 재사용하지 말 것\n- 고2~3 수준에서 사용 가능한 연결사 풀에서 **지문의 논리 관계에 맞는** 연결사를 유연하게 선택\n\n### 연결사 풀 (논리 관계별)\n대조: In contrast, By contrast, On the other hand, However, Conversely\n예시: For example, For instance, To illustrate\n결과/따라서: Therefore, Thus, Accordingly, As a result, Consequently\n요약: In short, In brief, In other words, To sum up\n추가: Furthermore, Moreover, In addition, Besides\n부연/강조: Indeed, In fact, Notably, That is\n역접: Nevertheless, Nonetheless, Even so, Yet\n\n### 오답 선지 구성 원칙\n- 정답 연결사와 **논리 관계가 다른** 연결사 조합 4개 구성\n- 각 오답은 (A) 또는 (B) 중 하나만 정답이거나, 둘 다 오답인 조합\n- 오답의 난이도 분포:\n  - 매력적 오답 2개: (A) 또는 (B) 하나가 그럴듯하게 맞아 보이는 조합\n  - 명백한 오답 2개: 논리 관계가 명확히 틀린 조합\n\n### 정답 번호 배치 규칙\n- 정답 번호는 ①~⑤ 중 매번 다른 번호를 랜덤하게 설정할 것\n\n---\n\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n\n## 출력 형식\nPASSAGE:\n[변형된 지문. (A), (B) 빈칸 포함]\nDIRECTION:\n다음 글의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은? [3점]\nCHOICES:\n① (A) ___ (B) ___\n② (A) ___ (B) ___\n③ (A) ___ (B) ___\n④ (A) ___ (B) ___\n⑤ (A) ___ (B) ___\nANSWER: [①~⑤ 중 정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: (A), (B) 각 빈칸에 해당 연결사가 들어가야 하는 논리적 근거를 간결하게 설명\n[선택지 해석]:\n① (A) [연결사] - [논리 관계] / (B) [연결사] - [논리 관계]\n② (A) [연결사] - [논리 관계] / (B) [연결사] - [논리 관계]\n③ (A) [연결사] - [논리 관계] / (B) [연결사] - [논리 관계]\n④ (A) [연결사] - [논리 관계] / (B) [연결사] - [논리 관계]\n⑤ (A) [연결사] - [논리 관계] / (B) [연결사] - [논리 관계]' },

];

// ─── 서술형 전용 공통 타입 (전역, 학교 비분리) ───
var globalSeoTypes = (function() {
  var saved = JSON.parse(localStorage.getItem('globalSeoTypes') || 'null');
  if (!saved || !Array.isArray(saved)) return JSON.parse(JSON.stringify(SEO_DEFAULT_TYPES));
  // SEO_DEFAULT_TYPES에 있지만 저장본에 없는 신규 항목 추가
  var savedIds = saved.map(function(t){ return t.id; });
  SEO_DEFAULT_TYPES.forEach(function(dt) {
    if (savedIds.indexOf(dt.id) < 0) saved.push(JSON.parse(JSON.stringify(dt)));
  });
  // seoRender 필드 보강 (구버전 저장본)
  saved.forEach(function(t) {
    if (!t.seoRender) {
      var def = SEO_DEFAULT_TYPES.filter(function(d){ return d.id === t.id; })[0];
      if (def) t.seoRender = def.seoRender;
    }
  });
  return saved;
}());

function saveGlobalSeoTypes() {
  localStorage.setItem('globalSeoTypes', JSON.stringify(globalSeoTypes));
  if (isMaster() && fbDb) fbSaveSharedSeoTypes();
}

function getActiveSeoTypes() {
  return JSON.parse(JSON.stringify(globalSeoTypes));
}

// seoSelected에 globalSeoTypes와 매칭되는 ID가 없으면 전체 ID로 자동 초기화
function healSeoSelected() {
  var allIds = globalSeoTypes.map(function(t){ return t.id; });
  var hasMatch = seoSelected.some(function(id){ return allIds.indexOf(id) >= 0; });
  if (!hasMatch && allIds.length) {
    seoSelected = allIds.slice();
    localStorage.setItem('seoSelected', JSON.stringify(seoSelected));
  }
}

// ─── STATE ───
function mergeWithDefaultQTypes(savedTypes) {
  if (!savedTypes) return JSON.parse(JSON.stringify(DEFAULT_TYPES));

  // seo_* 항목은 이제 globalSeoTypes에서 관리 → schoolPresets에서 제거
  savedTypes = savedTypes.filter(function(t){ return !t.id.startsWith('seo'); });

  // 저장된 목록에 없는 새 유형 자동 병합
  var savedIds = savedTypes.map(function(t){ return t.id; });
  DEFAULT_TYPES.forEach(function(dt) {
    if (savedIds.indexOf(dt.id) < 0) savedTypes.push(JSON.parse(JSON.stringify(dt)));
  });

  // DEFAULT_TYPES 순서대로 재정렬
  var orderMap = {};
  DEFAULT_TYPES.forEach(function(dt, idx) { orderMap[dt.id] = idx; });
  savedTypes.sort(function(a, b) {
    var idxA = orderMap[a.id] !== undefined ? orderMap[a.id] : 999;
    var idxB = orderMap[b.id] !== undefined ? orderMap[b.id] : 999;
    return idxA - idxB;
  });

  return savedTypes;
}

// 오프라인 계정(seum2025 등)과 클라우드 계정(manager) 간 데이터 혼선(덮어쓰기)을 방지하기 위한 키 격리 기능
var ISOLATED_KEYS = ['qTypes_v5', 'passages', 'passageSets', 'promptSets_v1', 'quotas', 'seoCount', 'seoSelected', 'examHistory', 'errorReports'];
function getIsolatedKey(k) {
  if (ISOLATED_KEYS.indexOf(k) >= 0) {
    var uid = sessionStorage.getItem('seumUserId') || '';
    if (CLOUD_CODES.indexOf(uid) >= 0) {
      return uid + '_' + k;
    }
  }
  return k;
}

var _originalGetItem = localStorage.getItem;
localStorage.getItem = function(k) {
  return _originalGetItem.call(localStorage, getIsolatedKey(k));
};

var _originalSetItem = localStorage.setItem;
localStorage.setItem = function(k, v) {
  var isolated = getIsolatedKey(k);
  try {
    _originalSetItem.call(localStorage, isolated, v);
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('Storage Quota Exceeded for key:', isolated);
      alert('⚠️ 브라우저 저장소 크기 한도(5MB)를 초과했습니다.\n\n해당 PC에 저장된 지문 세트/프롬프트 세트(무거운 레퍼런스 텍스트 포함)가 너무 많습니다. 과부하로 앱이 멈추는 것을 방지하기 위해 방금 저장이 임시 차단되었습니다.\n\n[설정] 창 우측 하단의 "로컬 데이터/캐시 완전 비우기" 버튼을 누르거나, 필요 없는 대형 세트를 수동으로 삭제해 공간을 넉넉하게 비워주세요.');
    } else {
      console.error(e);
    }
  }
};

var _originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function(k) {
  _originalRemoveItem.call(localStorage, getIsolatedKey(k));
};

function resetLocalStorageAndReload() {
  if (confirm("🚨 경고: 현재 PC에 저장된 모든 지문, 프롬프트 세트, 설정, 출제 히스토리가 완전히 삭제됩니다.\n\n(참고: 매니저 등 클라우드 동기화 코드를 사용하는 선생님은 확인을 눌러도 앱 재시작 시 서버 데이터로 다시 복구되므로 안전합니다. seum2025 코드는 싹 지워집니다.)\n\n정말 전부 지우고 공간을 쾌적하게 초기화하시겠습니까?")) {
    var storedKey = localStorage.getItem('geminiKey');
    var storedClaude = localStorage.getItem('claudeKey');
    localStorage.clear();
    if (storedKey) localStorage.setItem('geminiKey', storedKey);
    if (storedClaude) localStorage.setItem('claudeKey', storedClaude);
    alert('모든 잔여 로컬 데이터가 삭제되었습니다. 앱을 재시작합니다.');
    location.reload();
  }
}

// ─── 로컬(seum2025) → 클라우드 데이터 마이그레이션 ───
function showMigrationIfCloud() {
  var uid = sessionStorage.getItem('seumUserId') || '';
  var sec = document.getElementById('migrationSection');
  var label = document.getElementById('migTargetCode');
  if (!sec) return;
  if (CLOUD_CODES.indexOf(uid) >= 0) {
    // seum2025 plain-key 데이터가 존재하는지 확인
    var hasLocalData = false;
    var checkKeys = ['qTypes_v5', 'passages', 'passageSets', 'promptSets_v1'];
    checkKeys.forEach(function(k) {
      var val = _originalGetItem.call(localStorage, k);  // plain key (격리 우회)
      if (val && val !== '[]' && val !== '{}' && val !== 'null') hasLocalData = true;
    });
    if (hasLocalData) {
      sec.style.display = '';
      if (label) label.textContent = uid;
    } else {
      sec.style.display = 'none';
    }
  } else {
    sec.style.display = 'none';
  }
}

function migrateFromLocal() {
  var uid = sessionStorage.getItem('seumUserId') || '';
  if (CLOUD_CODES.indexOf(uid) < 0) {
    alert('클라우드 코드로 로그인된 상태에서만 사용할 수 있습니다.');
    return;
  }

  // seum2025가 사용하는 plain-key 데이터 확인
  var localPassages    = _originalGetItem.call(localStorage, 'passages');
  var localPassageSets = _originalGetItem.call(localStorage, 'passageSets');
  var localPromptSets  = _originalGetItem.call(localStorage, 'promptSets_v1');
  var localQTypes      = _originalGetItem.call(localStorage, 'qTypes_v5');
  var localQuotas      = _originalGetItem.call(localStorage, 'quotas');
  var localSeoCount    = _originalGetItem.call(localStorage, 'seoCount');
  var localSeoSelected = _originalGetItem.call(localStorage, 'seoSelected');

  // 가져올 데이터 요약
  var pCount = 0, psCount = 0, prCount = 0;
  try { pCount  = JSON.parse(localPassages || '[]').length; } catch(e){}
  try { psCount = Object.keys(JSON.parse(localPassageSets || '{}')).length; } catch(e){}
  try { prCount = Object.keys(JSON.parse(localPromptSets || '{}')).length; } catch(e){}

  if (pCount === 0 && psCount === 0 && prCount === 0) {
    alert('이 PC에 seum2025 로컬 데이터가 없습니다.\n\nseum2025 코드로 저장한 적이 있는 PC에서 실행해주세요.');
    return;
  }

  var summary = '📦 seum2025 로컬 데이터를 [' + uid + '] 클라우드 계정으로 복사합니다.\n\n'
    + '• 입력된 지문: ' + pCount + '개\n'
    + '• 지문 세트: ' + psCount + '개\n'
    + '• 프롬프트 세트: ' + prCount + '개\n\n'
    + '현재 [' + uid + '] 계정의 데이터가 덮어씌워집니다.\n계속하시겠습니까?';

  if (!confirm(summary)) return;

  // plain-key 데이터를 현재 클라우드 유저의 격리 키로 복사
  var prefix = uid + '_';
  if (localQTypes)      _originalSetItem.call(localStorage, prefix + 'qTypes_v5',    localQTypes);
  if (localPassages)    _originalSetItem.call(localStorage, prefix + 'passages',     localPassages);
  if (localPassageSets) _originalSetItem.call(localStorage, prefix + 'passageSets',  localPassageSets);
  if (localPromptSets)  _originalSetItem.call(localStorage, prefix + 'promptSets_v1',localPromptSets);
  if (localQuotas)      _originalSetItem.call(localStorage, prefix + 'quotas',       localQuotas);
  if (localSeoCount)    _originalSetItem.call(localStorage, prefix + 'seoCount',     localSeoCount);
  if (localSeoSelected) _originalSetItem.call(localStorage, prefix + 'seoSelected',  localSeoSelected);

  // 메모리에 반영 (격리된 getItem을 통해 자동으로 prefix 키를 읽음)
  reloadMemoryForUser();

  // Firebase에 즉시 동기화
  if (fbDb) {
    fbSyncImmediate();
    var st = document.getElementById('migStatus');
    if (st) st.textContent = '✅ 복사 완료 · 클라우드 동기화 중...';
    setTimeout(function() {
      if (st) st.textContent = '✅ 완료! 이제 다른 PC에서도 [' + uid + '] 로 접속하면 동일한 데이터를 사용할 수 있습니다.';
    }, 2500);
  } else {
    var st = document.getElementById('migStatus');
    if (st) st.textContent = '✅ 로컬 복사 완료 (클라우드 미연결 — 새로고침 후 자동 동기화)';
  }

  alert('✅ seum2025 데이터가 [' + uid + '] 계정으로 성공적으로 복사되었습니다!\n\n이제 어떤 PC에서든 [' + uid + '] 코드로 접속하면 동일한 데이터를 사용할 수 있습니다.');
}

// ─── 지문 변형 프롬프트 기본값 ───
var DEFAULT_TRANSFORM_MAINTAIN = "당신은 수능 영어 지문 출제 전문가입니다.\n다음 원본 지문을 아래 [변형 조건 및 작성 지침]에 따라 반드시 '영어 지문만' 출력하세요. (한국어나 부가 설명, 마크다운 표시 절대로 출력 금지. 오직 생성된 영어 단락만 반환할 것)\n\n[변형 조건 및 작성 지침]\n1. 어휘 및 문장 구조 변형 (Paraphrasing): \n   - 원문의 핵심 키워드 및 주요 표현을 적절한 동의어(Synonyms)나 유의어로 전면 교체할 것.\n   - 능동태와 수동태의 전환, 분사구문 활용, 관계사절 축약 등 문장의 문법적 구조를 다채롭게 변경할 것.\n2. 내용 및 소재 완전 유지 (No Topic Change): \n   - 원문에 등장하는 핵심 대상(소재), 구체적인 예시, 비유, 그리고 필자의 결론 및 주장은 전혀 바꾸지 말고 그대로 유지할 것.\n   - 글의 상황이나 분야를 다른 것으로 교체하지 말고, 오직 어휘와 문장 구조만 다른 표현으로 패러프레이징할 것.\n3. 난이도 및 톤 유지: \n   - 변형된 지문의 어휘 수준과 구문 복잡성은 한국 고등학교 2~3학년 수준(수능 모의고사 난이도)에 정확히 맞출 것.\n   - 학술적이고 객관적인 톤을 유지할 것.\n4. 논리적 완결성: \n   - 겉보기에는 다른 지문처럼 보이더라도, 글을 다 읽고 났을 때 전달하는 궁극적인 메시지는 원문과 일치해야 함. 문장 간의 연결사(Transitions)를 논리에 맞게 적절히 재배치할 것.\n5. 분량 및 완결성 유지: \n   - 변형된 지문의 전체 길이는 원문과 비슷한 단어 수(Word count)를 유지하되, 글이 중간에 끊기지 않고 자연스럽게 결론까지 이어져 하나의 완결된 단락(Complete paragraph)이 되도록 작성할 것.\n\n금지사항\n- 과도한 패러프레이징으로 원문을 훼손하지 말것\n- 지나치게 어려운 수준의 단어로 구성하지 말것\n- 고3 수능, EBS 수능특강 수준의 단어들로 구성할 것\n\n[원본 지문]\n{TEXT}";

var DEFAULT_TRANSFORM_CHANGE = "당신은 수능 영어 지문 출제 전문가입니다.\n다음 원본 지문을 아래 [변형 조건 및 작성 지침]에 따라 반드시 '영어 지문만' 출력하세요. (한국어나 부가 설명, 마크다운 표시 절대로 출력 금지. 오직 생성된 영어 단락만 반환할 것)\n\n[변형 조건 및 작성 지침]\n1. 소재 유지 및 주제 전환: \n   - 원문에 등장하는 핵심 대상(예: 항생제, 재활용, 시간과 기다림 등)은 그대로 글의 중심 소재로 사용하세요.\n   - 단, 글의 결론이나 필자의 주장은 원문과 전혀 다른 새로운 관점(예: 심리적 관점 -> 경제적/기술적 관점, 비판적 시각 -> 긍정적 시각 등)으로 완전히 새롭게 전개하세요.\n2. 새로운 논리 구조 구축: \n   - 바뀐 주제를 뒷받침할 수 있도록 완전히 새로운 근거, 예시, 논리 전개 방식을 도입하세요. 원문의 문장 구조나 전개 방식을 단순히 패러프레이징하는 것을 넘어, 글의 뼈대 자체를 새로 짜야 합니다.\n3. 어휘 및 구문 수준 (수능 난이도): \n   - 한국 고등학교 2~3학년 수능 모의고사 수준에 맞춘 어휘를 사용하세요.\n   - 분사구문, 관계사절, 도치, 양보 구문 등 수능 빈출 복문 구조를 적극적으로 활용하세요.\n4. 출제 적합성: \n   - 글의 서두나 말미에 새로운 주제를 명확히 드러내는 핵심 문장(Topic Sentence)을 반드시 포함하여, 추후 '주제 찾기'나 '요지 추론' 문제로 출제하기 좋게 구성하세요.\n5. 분량 및 완결성 유지: \n   - 변형된 지문의 전체 길이는 원문과 비슷한 단어 수(Word count)를 유지하되, 글이 중간에 끊기지 않고 자연스럽게 결론까지 이어져 하나의 완결된 단락(Complete paragraph)이 되도록 작성할 것.\n\n금지사항\n- 과도한 패러프레이징으로 원문을 훼손하지 말것\n- 지나치게 어려운 수준의 단어로 구성하지 말것\n- 고3 수능, EBS 수능특강 수준의 단어들로 구성할 것{DIRECTION}\n\n[원본 지문]\n{TEXT}";

var transformPromptMaintain = localStorage.getItem('master_transformPrompt_maintain') || DEFAULT_TRANSFORM_MAINTAIN;
var transformPromptChange   = localStorage.getItem('master_transformPrompt_change')   || DEFAULT_TRANSFORM_CHANGE;

// ─── 학교별 지문 변형 프롬프트 키/값 헬퍼 ───
function getTransformStorageKey(cat, mode) {
  var catSuffix = (cat && cat !== '개인설정' && cat !== '기본설정') ? '_' + cat : '';
  return 'master_transformPrompt_' + mode + catSuffix;
}
function getTransformPromptForCat(cat, mode) {
  var val = localStorage.getItem(getTransformStorageKey(cat, mode));
  if (!val) val = localStorage.getItem('master_transformPrompt_' + mode); // 전역 폴백
  return val || (mode === 'maintain' ? DEFAULT_TRANSFORM_MAINTAIN : DEFAULT_TRANSFORM_CHANGE);
}

// 캐시 초기화를 위해 키를 'qTypes_v5'로 업데이트
var qTypes = mergeWithDefaultQTypes(JSON.parse(localStorage.getItem('qTypes_v5') || 'null'));
var passages    = JSON.parse(localStorage.getItem('passages')    || '[]');
var quotas      = JSON.parse(localStorage.getItem('quotas')      || 'null') || {};
var seoCount    = parseInt(localStorage.getItem('seoCount')      || '1');
var seoSelected = JSON.parse(localStorage.getItem('seoSelected') || '[]');
// 구형 seo id → 신규 카탈로그 id 마이그레이션
(function migrateSeoSelected() {
  var idMap = {
    seo1:'seo_topic_1', seo2:'seo_blanks_1', seo3:'seo_compose_1', seo4:'seo_content', seo5:'seo_summary_2',
    seo_topic:'seo_topic_1', seo_blanks:'seo_blanks_1', seo_compose:'seo_compose_1',
    seo_qa:'seo_content', seo_grammar:'seo_grammar_1', seo_content_kr:'seo_content',
    seo_summary_3:'seo_summary_3', seo_summary_2:'seo_summary_2', seo_topic_plus_content2:'seo_topic_plus_content2'
  };
  var changed = false;
  seoSelected = seoSelected.map(function(id) {
    if (idMap[id] && idMap[id] !== id) { changed = true; return idMap[id]; }
    return id;
  });
  // 중복 제거
  seoSelected = seoSelected.filter(function(id, idx){ return seoSelected.indexOf(id) === idx; });
  if (changed) localStorage.setItem('seoSelected', JSON.stringify(seoSelected));
  // 매칭 ID 없으면 전체로 초기화 (신규 사용자 대응)
  // healSeoSelected()는 globalSeoTypes 로드 후 호출
}());
var promptSets  = JSON.parse(localStorage.getItem('promptSets_v1') || '{}');

var SCHOOL_NAMES = ['동백고1', '동백고2', '백현고', '청덕고', '성지고1', '성지고2'];
// schoolPresets is non-isolated (shared across all user codes on same browser)
var schoolPresets = JSON.parse(_originalGetItem.call(localStorage, 'schoolPresets') || '{}');
// Migrate old '동백고' → '동백고1', '동백고2'
(function() {
  if (schoolPresets['동백고'] && !schoolPresets['동백고1'] && !schoolPresets['동백고2']) {
    schoolPresets['동백고1'] = JSON.parse(JSON.stringify(schoolPresets['동백고']));
    schoolPresets['동백고2'] = JSON.parse(JSON.stringify(schoolPresets['동백고']));
  }
})();
SCHOOL_NAMES.forEach(function(s) {
  if (!schoolPresets[s]) schoolPresets[s] = JSON.parse(JSON.stringify(DEFAULT_TYPES));
});

function getSchoolLabel(cat) {
  var labels = {
    '동백고1': '동백고 1학년', '동백고2': '동백고 2학년',
    '백현고': '백현고', '청덕고': '청덕고',
    '성지고1': '성지고 1학년', '성지고2': '성지고 2학년',
    '기본설정': '기본 설정', '개인설정': '개인 프롬프트'
  };
  return labels[cat] || cat;
}
function saveSchoolPresets() {
  _originalSetItem.call(localStorage, 'schoolPresets', JSON.stringify(schoolPresets));
  if (isMaster() && fbDb) fbSaveSharedSchoolPresets();
}

function fbSaveSharedSchoolPresets() {
  if (!fbDb || !isMaster()) return;
  setSyncStatus('syncing', '☁ 저장 중...');
  fbDb.collection('shared').doc('schoolPresets').set({ presets: schoolPresets })
    .then(function() { setSyncStatus('syncok', '☁ ' + fbUserId()); })
    .catch(function(e) { setSyncStatus('syncerr', '☁ 오류'); console.error('schoolPresets 저장 오류:', e); });
}

function fbSaveSharedSchoolPresetsManual() {
  if (!fbDb) { alert('Firebase에 연결되지 않았습니다. 새로고침 후 다시 시도해주세요.'); return; }
  if (!isMaster()) { alert('관리자만 사용할 수 있습니다.'); return; }
  setSyncStatus('syncing', '☁ 저장 중...');
  fbDb.collection('shared').doc('schoolPresets').set({ presets: schoolPresets })
    .then(function() {
      setSyncStatus('syncok', '☁ ' + fbUserId());
      alert('✅ 모든 학교 프롬프트가 서버에 저장되었습니다.\n다른 계정에서 새로고침 또는 재로그인 시 반영됩니다.');
    })
    .catch(function(e) { setSyncStatus('syncerr', '☁ 오류'); alert('저장 오류: ' + e.message); console.error(e); });
}

function fbSaveSharedSeoTypes() {
  if (!fbDb || !isMaster()) return;
  fbDb.collection('shared').doc('seoTypes').set({ types: globalSeoTypes })
    .catch(function(e) { console.error('seoTypes 저장 오류:', e); });
}

function fbPullSharedSeoTypes() {
  if (!fbDb) return;
  fbDb.collection('shared').doc('seoTypes').get()
    .then(function(doc) {
      if (!doc.exists || !doc.data() || !Array.isArray(doc.data().types)) {
        if (isMaster()) fbSaveSharedSeoTypes();
        return;
      }
      var pulled = doc.data().types;
      // 신규 항목 보강 (서버에 없는 SEO_DEFAULT_TYPES 항목 추가)
      var pulledIds = pulled.map(function(t){ return t.id; });
      SEO_DEFAULT_TYPES.forEach(function(dt) {
        if (pulledIds.indexOf(dt.id) < 0) pulled.push(JSON.parse(JSON.stringify(dt)));
      });
      // seoRender 필드 보강
      pulled.forEach(function(t) {
        if (!t.seoRender) {
          var def = SEO_DEFAULT_TYPES.filter(function(d){ return d.id === t.id; })[0];
          if (def) t.seoRender = def.seoRender;
        }
      });
      globalSeoTypes = pulled;
      localStorage.setItem('globalSeoTypes', JSON.stringify(globalSeoTypes));
      if (typeof editingSeoTypes !== 'undefined') editingSeoTypes = JSON.parse(JSON.stringify(globalSeoTypes));
      // seoSelected가 새 globalSeoTypes와 매칭 안 되면 전체로 초기화
      healSeoSelected();
      renderSeoTypeRows();
      renderPassageList();
    })
    .catch(function(e) { console.error('seoTypes 불러오기 오류:', e); });
}

function fbPullSharedSchoolPresets() {
  if (!fbDb) return;
  fbDb.collection('shared').doc('schoolPresets').get()
    .then(function(doc) {
      if (!doc.exists || !doc.data() || !doc.data().presets) {
        // 서버에 문서 없음 — master_andy면 현재 로컬 데이터를 서버에 최초 업로드
        if (isMaster()) {
          console.log('shared/schoolPresets 없음 → 로컬 데이터 서버 업로드 시작');
          fbSaveSharedSchoolPresets();
        }
        return;
      }
      var pulled = doc.data().presets;
      SCHOOL_NAMES.forEach(function(s) {
        if (pulled[s] && Array.isArray(pulled[s])) schoolPresets[s] = pulled[s];
      });
      _originalSetItem.call(localStorage, 'schoolPresets', JSON.stringify(schoolPresets));
      // 현재 설정 탭이 학교 카테고리면 editingQTypes도 갱신
      if (SCHOOL_NAMES.indexOf(settingsCat) >= 0) {
        editingQTypes = mergeWithDefaultQTypes(JSON.parse(JSON.stringify(schoolPresets[settingsCat] || DEFAULT_TYPES)));
        renderTypeList();
        if (editingQTypes.length) selectType(0);
      }
      renderSettingsCategoryTabs();
    })
    .catch(function(e) { console.error('schoolPresets 불러오기 오류:', e); });
}

var settingsCat = '개인설정'; // which category the settings editor is currently showing
var activeCategory = sessionStorage.getItem('seumActiveCategory') || '개인설정'; // for generation
var editingQTypes = JSON.parse(JSON.stringify(DEFAULT_TYPES)); // array currently shown in editor

// [자동 복구 및 다이어트 로직] 기존에 에러를 유발했던 무거운 레퍼런스 데이터들을 일괄 제거
function autoHealStorage() {
  var needsHeal = false;
  Object.keys(promptSets).forEach(function(k) {
    if (Array.isArray(promptSets[k])) {
      promptSets[k].forEach(function(t) {
        if (t.references && t.references.length > 0) { t.references = []; needsHeal = true; }
        if (t.reference) { t.reference = ''; needsHeal = true; }
      });
    }
  });
  if (needsHeal) {
    try {
      localStorage.setItem('promptSets_v1', JSON.stringify(promptSets));
      console.log('✅ 기존 프롬프트 세트 내 무거운 레퍼런스가 자동 제거되어 저장 용량이 복구되었습니다.');
    } catch(e) {}
  }
}
autoHealStorage(); // 초기 구동 시 1회 즉시 실행

var selIdx  = 0;
var editIdx = -1;
var loadedPromptSetName = localStorage.getItem('loadedPromptSetName') || '';

// ─── 연습문제 제작 STATE ───
var pracPassages = [];          // [{ title, text }, ...]
var pracActiveIdx = -1;         // index of the selected passage (-1 = none)
var pracEditIdx = -1;           // index being edited in modal (-1 = new)
var pracSelectedTypes = [];     // array of typeId strings

// ─── 연습문제 제작 FUNCTIONS ───

function openImportSetModal() {
  var keys = Object.keys(passageSets);
  var sel = document.getElementById('importSetSelect');
  var preview = document.getElementById('importSetPreview');
  if (!sel) return;
  // 저장된 세트가 없으면 안내
  if (!keys.length) {
    alert('지문 입력 페이지에 저장된 세트가 없습니다.\n먼저 지문 입력 탭에서 지문 세트를 저장해 주세요.');
    return;
  }
  // 드롭다운 채우기
  sel.innerHTML = '<option value="">— 세트 선택 —</option>' +
    keys.map(function(k) {
      return '<option value="' + k.replace(/"/g, '&quot;') + '">' + k + ' (' + passageSets[k].length + '개 지문)</option>';
    }).join('');
  if (preview) { preview.style.display = 'none'; preview.textContent = ''; }
  // 세트 선택 시 미리보기
  sel.onchange = function() {
    var key = sel.value;
    if (!key || !passageSets[key]) { preview.style.display = 'none'; return; }
    var set = passageSets[key];
    preview.style.display = '';
    preview.innerHTML = '<strong>' + key + '</strong> — 지문 ' + set.length + '개:<br>' +
      set.map(function(p, i) { return (i+1) + '. ' + (p.title || '제목 없음'); }).join('<br>');
  };
  document.getElementById('pracImportModal').style.display = 'flex';
}

function closeImportSetModal() {
  document.getElementById('pracImportModal').style.display = 'none';
}

function confirmImportSet() {
  var key = document.getElementById('importSetSelect').value;
  if (!key || !passageSets[key]) { alert('세트를 선택해 주세요.'); return; }
  var mode = document.querySelector('input[name="importMode"]:checked')?.value || 'replace';
  var imported = passageSets[key].map(function(p) { return { title: p.title || '', text: p.text || '' }; });
  if (mode === 'replace') {
    pracPassages = imported;
  } else {
    pracPassages = pracPassages.concat(imported);
  }
  pracActiveIdx = pracPassages.length ? 0 : -1;
  closeImportSetModal();
  renderPracPassageArea();
}

function openPracModal(editIdx) {
  pracEditIdx = (editIdx === undefined ? -1 : editIdx);
  var m = document.getElementById('pracModal');
  var titleEl = document.getElementById('pracMTitle');
  var textEl  = document.getElementById('pracMText');
  var headEl  = document.querySelector('#pracModal .mdhead span');
  if (pracEditIdx >= 0 && pracPassages[pracEditIdx]) {
    titleEl.value = pracPassages[pracEditIdx].title || '';
    textEl.value  = pracPassages[pracEditIdx].text  || '';
    if (headEl) headEl.textContent = '지문 편집';
  } else {
    titleEl.value = '';
    textEl.value  = '';
    if (headEl) headEl.textContent = '지문 추가 (연습문제 제작)';
  }
  m.style.display = 'flex';
  textEl.focus();
}

function closePracModal() {
  document.getElementById('pracModal').style.display = 'none';
}

function savePracPassage() {
  var title = document.getElementById('pracMTitle').value.trim();
  var text  = document.getElementById('pracMText').value.trim();
  if (!text) { alert('지문을 입력해주세요.'); return; }
  if (pracEditIdx >= 0 && pracPassages[pracEditIdx]) {
    pracPassages[pracEditIdx] = { title: title, text: text };
  } else {
    pracPassages.push({ title: title, text: text });
    if (pracPassages.length === 1) pracActiveIdx = 0; // 첫 지문은 자동 선택
  }
  renderPracPassageArea();
  closePracModal();
}

function delPracPassage(i) {
  pracPassages.splice(i, 1);
  if (pracActiveIdx >= pracPassages.length) pracActiveIdx = pracPassages.length - 1;
  renderPracPassageArea();
}

function clearAllPracPassages() {
  if (pracPassages.length && !confirm('모든 지문을 삭제하시겠습니까?')) return;
  pracPassages = [];
  pracActiveIdx = -1;
  renderPracPassageArea();
}

function selectPracPassage(i) {
  pracActiveIdx = i;
  renderPracPassageArea();
}

function renderPracPassageArea() {
  var el = document.getElementById('pracPassageArea');
  if (!el) return;
  if (!pracPassages.length) {
    el.innerHTML = '<div class="empty"><div class="eic">📖</div><div class="eti">지문이 없습니다</div><div>"+ 지문 추가" 버튼으로 지문을 입력하세요</div></div>';
    return;
  }
  el.innerHTML = pracPassages.map(function(p, i) {
    var isActive = i === pracActiveIdx;
    var activeBorder = isActive ? 'border:2px solid var(--gr);background:var(--grs);' : '';
    var activeBadge  = isActive
      ? '<span style="background:var(--gr);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;margin-left:6px;">✓ 선택됨</span>'
      : '<span style="font-size:11px;color:var(--ink3);margin-left:6px;">클릭하여 선택</span>';
    return '<div class="pc" style="cursor:pointer;' + activeBorder + '" onclick="selectPracPassage(' + i + ')">' +
      '<div class="pchead">' +
      '<span class="pnum">' + (i+1) + '</span>' +
      '<span style="font-size:13px;font-weight:600;color:var(--ink2);flex:1">' + (p.title || '제목 없음') + '</span>' +
      activeBadge +
      '</div>' +
      '<div class="pprev">' + p.text + '</div>' +
      '<div class="pcfoot">' +
      '<button class="mb" onclick="event.stopPropagation();openPracModal(' + i + ')">✎ 편집</button>' +
      '<button class="mb d" onclick="event.stopPropagation();delPracPassage(' + i + ')">✕ 삭제</button>' +
      '</div></div>';
  }).join('');
}

function renderPracTypeCheckboxes() {
  var el = document.getElementById('pracTypeList');
  if (!el) return;
  var types = getActiveQTypes();
  el.innerHTML = types.map(function(t, i) {
    var checked = pracSelectedTypes.indexOf(t.id) >= 0;
    var checkedAttr = checked ? ' checked' : '';
    var activeStyle = checked ? 'background:var(--grs);border-color:#a0d4b4;' : '';
    return '<div class="qrow" id="pracrow_' + t.id + '" style="cursor:pointer;' + activeStyle + '" onclick="togglePracType(\'' + t.id + '\')">' +
      '<div class="qtype">' +
      '<div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' +
      t.name +
      '</div>' +
      '<input type="checkbox" id="prac_' + t.id + '" value="' + t.id + '"' + checkedAttr + ' onclick="event.stopPropagation();togglePracType(\'' + t.id + '\')" style="width:16px;height:16px;cursor:pointer;accent-color:var(--gr);">' +
      '</div>';
  }).join('');
  updatePracTypeSummary();
}

function togglePracType(id) {
  var idx = pracSelectedTypes.indexOf(id);
  var nowChecked;
  if (idx >= 0) {
    pracSelectedTypes.splice(idx, 1);
    nowChecked = false;
  } else {
    pracSelectedTypes.push(id);
    nowChecked = true;
  }
  var row = document.getElementById('pracrow_' + id);
  var cb  = document.getElementById('prac_' + id);
  if (row) row.style.cssText = 'cursor:pointer;' + (nowChecked ? 'background:var(--grs);border-color:#a0d4b4;' : '');
  if (cb)  cb.checked = nowChecked;
  updatePracTypeSummary();
}

function pracSelectAll() {
  pracSelectedTypes = getActiveQTypes().map(function(t){ return t.id; });
  renderPracTypeCheckboxes();
}

function pracSelectNone() {
  pracSelectedTypes = [];
  renderPracTypeCheckboxes();
}

function updatePracTypeSummary() {
  var el = document.getElementById('pracTypeSummary');
  if (el) el.textContent = '선택된 유형: ' + pracSelectedTypes.length + '개';
}

async function startPracGeneration() {
  try {
  var key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('상단에 API 키를 먼저 입력해주세요.'); return; }
  if (!pracPassages.length || pracActiveIdx < 0) { alert('지문을 추가하고 선택해주세요.'); return; }
  if (!pracSelectedTypes.length) { alert('문제 유형을 하나 이상 선택해주세요.'); return; }

  var activePrac = pracPassages[pracActiveIdx];
  var aqt = getActiveQTypes();
  var assignment = pracSelectedTypes.map(function(tid) {
    var type = null;
    for (var j = 0; j < aqt.length; j++) { if (aqt[j].id === tid) { type = aqt[j]; break; } }
    return type ? { passage: activePrac, typeId: tid } : null;
  }).filter(function(a){ return a !== null; });

  if (!assignment.length) { alert('선택된 유형이 없습니다.'); return; }

  switchTab('output');
  document.getElementById('pbWrap').style.display    = 'block';
  document.getElementById('pbWrap').classList.add('pulse-glow');
  document.getElementById('pbLabel').style.display   = 'block';
  document.getElementById('copyQBtn').style.display  = 'none';
  document.getElementById('copyABtn').style.display  = 'none';
  document.getElementById('copyAllBtn').style.display= 'none';
  document.getElementById('retryFailedBtn').style.display= 'none';
  _genCancelled = false;
  document.getElementById('pracGenerateBtn').disabled = true;
  document.getElementById('cancelBtn').style.display = '';

  var now = new Date();
  var dateStr = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0');

  document.getElementById('outputArea').innerHTML =
    '<div class="slide-fade-in" style="margin-bottom:16px;padding:13px 18px;background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);">' +
    '<div style="font-weight:700;font-size:14px;margin-bottom:10px;font-family:\'Playfair Display\',serif;">🔄 연습문제 생성 중... (' + assignment.length + '유형)</div>' +
    '<div id="statusList"></div></div>';

  var statusEl = document.getElementById('statusList');
  var rawResults = [];

  for (var i = 0; i < assignment.length; i++) {
    var item = assignment[i];
    var type = null;
    var _aqt = getActiveQTypes();
    for (var j = 0; j < _aqt.length; j++) { if (_aqt[j].id === item.typeId) { type = _aqt[j]; break; } }
    if (!type) continue;

    var sid = 'st' + i;
    statusEl.insertAdjacentHTML('beforeend',
      '<div class="gi slide-fade-in" id="' + sid + '" style="animation-delay: ' + (Math.min(i, 10) * 0.1) + 's; animation-fill-mode: both;"><div class="spin"></div>' +
      '<span>' + (i+1) + '번 생성 중 — [' + type.name + ']</span></div>');
    document.getElementById(sid).scrollIntoView({ behavior:'smooth', block:'nearest' });
    document.getElementById('pbFill').style.width = Math.round(i/assignment.length*100) + '%';
    document.getElementById('pbLabel').textContent = (i+1) + ' / ' + assignment.length;

    if (_genCancelled) break;
    if (i > 0) await wait(8000);
    if (_genCancelled) break;

    try {
      var result = await callWithRetry(type, item.passage.text, sid);
      rawResults.push({ num:i+1, type:type, result:result, passageTitle: item.passage.title||'' });
      var el = document.getElementById(sid);
      el.innerHTML = '<span class="di">✓</span><span>' + (i+1) + '번 [' + type.name + '] — 완료</span>';
      el.style.background  = 'var(--grs)';
      el.style.borderColor = '#a0d4b4';
    } catch(err) {
      rawResults.push({ num:i+1, type:type, result:null, error:err.message, passageTitle: item.passage.title||'' });
      var el2 = document.getElementById(sid);
      el2.innerHTML = '<span class="ei">✗</span><span>' + (i+1) + '번 [' + type.name + '] — 실패: ' + err.message + '</span>';
      el2.style.background = 'var(--acs)';
    }
  }

  document.getElementById('pbFill').style.width   = '100%';
  document.getElementById('pbWrap').classList.remove('pulse-glow');
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('pbLabel').textContent  = '완료 ' + assignment.length + '/' + assignment.length;
  document.getElementById('pracGenerateBtn').disabled = false;

  _curAssignment = assignment;
  _curRawResults = rawResults;
  _curDateStr = dateStr;
  _curIsRandom = false;

  compileAndRenderOutput();

  } catch(fatalErr) {
    document.getElementById('pracGenerateBtn').disabled = false;
    alert('오류가 발생했습니다: ' + fatalErr.message);
    console.error(fatalErr);
  }
}

function renderActivePromptSet() {
  renderActiveCategoryDisplay();
}

function persist(immediate) {
  localStorage.setItem('qTypes_v5',   JSON.stringify(qTypes));
  localStorage.setItem('passages',    JSON.stringify(passages));
  localStorage.setItem('quotas',      JSON.stringify(quotas));
  localStorage.setItem('seoCount',    seoCount);
  localStorage.setItem('seoSelected', JSON.stringify(seoSelected));
  if (immediate) fbSyncImmediate(); else fbSyncDebounced();
}

// ─── TABS ───
function switchTab(name) {
  document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById('panel-' + name).classList.add('active');
  var order = ['passages','practice','output','report','settings'];
  var idx = order.indexOf(name);
  if (idx >= 0) document.querySelectorAll('.tab')[idx].classList.add('active');
  if (name === 'practice') {
    renderPracTypeCheckboxes();
    var sel = document.getElementById('pracActiveCategorySelect');
    if (sel) sel.value = activeCategory;
    var disp = document.getElementById('pracActivePromptSetDisplay');
    if (disp) {
      disp.textContent = '적용 프롬프트: [' + getSchoolLabel(activeCategory) + ']';
    }
  }
  if (name === 'check-table') {
    document.querySelectorAll('.tab')[5].classList.add('active');
  }
}

// ─── 학교 prefix 기반 객관식 유형 필터링 ───
// 학교 코드 목록(향후 학교 추가 시 여기에만 추가)
var SCHOOL_PREFIXES = ['동백', '백현', '청덕', '성지'];

// activeCategory("동백고1","청덕고" 등)에서 학교명만 추출. 개인/기본설정이면 ''.
function getSchoolFromCategory(cat) {
  if (!cat || cat === '개인설정' || cat === '기본설정') return '';
  for (var i = 0; i < SCHOOL_PREFIXES.length; i++) {
    if (cat.indexOf(SCHOOL_PREFIXES[i]) === 0) return SCHOOL_PREFIXES[i];
  }
  return '';
}

// 유형명("청덕2_순서+내용일치")에서 학교 prefix 추출. 없으면 ''.
function getTypeSchoolPrefix(name) {
  if (!name) return '';
  for (var i = 0; i < SCHOOL_PREFIXES.length; i++) {
    var sp = SCHOOL_PREFIXES[i];
    // "학교명" 또는 "학교명+숫자" 뒤에 "_" 가 오면 prefix로 인식
    var re = new RegExp('^' + sp + '\\d*_');
    if (re.test(name)) return sp;
  }
  return '';
}

// 유형 1개가 현재 카테고리에서 표시 가능한지 판정.
function isTypeVisibleForCategory(type, cat) {
  var pfx = getTypeSchoolPrefix(type && type.name);
  if (!pfx) return true;                 // 기본 유형: 항상 표시
  var sch = getSchoolFromCategory(cat);
  if (!sch) return false;                // 개인/기본 설정: prefix 유형 숨김
  return pfx === sch;                    // 학교 일치 시만 표시
}

// 배열 단위 필터 (객관식 유형용; 서술형은 적용 안 함)
function filterObjTypesByCategory(types) {
  // 학교별 필터링 제거 — 모든 카테고리에서 전체 유형 표시
  if (!Array.isArray(types)) return types;
  return types;
}

// ─── ACTIVE CATEGORY (for generation) ───
function getActiveQTypes() {
  if (SCHOOL_NAMES.indexOf(activeCategory) >= 0 && schoolPresets[activeCategory] && schoolPresets[activeCategory].length) {
    return mergeWithDefaultQTypes(JSON.parse(JSON.stringify(schoolPresets[activeCategory])));
  }
  if (activeCategory === '기본설정') return JSON.parse(JSON.stringify(DEFAULT_TYPES));
  return JSON.parse(JSON.stringify(qTypes)); // 개인설정 or fallback
}

function setActiveCategory(cat) {
  activeCategory = cat;
  sessionStorage.setItem('seumActiveCategory', cat);
  var sel = document.getElementById('activeCategorySelect');
  if (sel) sel.value = cat;
  var pracSel = document.getElementById('pracActiveCategorySelect');
  if (pracSel) pracSel.value = cat;
  renderQuotaRows();
  renderSeoTypeRows();
  renderPassageList();
  updateQSum();
  renderActiveCategoryDisplay();
  renderPracTypeCheckboxes();
}

function renderActiveCategoryDisplay() {
  var catLabel = getSchoolLabel(activeCategory);
  var el = document.getElementById('activePromptSetDisplay');
  if (el) el.textContent = '적용 프롬프트: [' + catLabel + ']';
  var pracDisp = document.getElementById('pracActivePromptSetDisplay');
  if (pracDisp) pracDisp.textContent = '적용 프롬프트: [' + catLabel + ']';
}

// ─── SETTINGS CATEGORY ───
var settingsPaneMode = 'obj'; // 'obj' | 'seo'
var editingSeoTypes = JSON.parse(JSON.stringify(globalSeoTypes));

function switchSettingsPane(mode) {
  settingsPaneMode = mode;
  var objArea  = document.getElementById('settingsObjArea');
  var seoArea  = document.getElementById('settingsSeoArea');
  var btnObj   = document.getElementById('settingsPaneObj');
  var btnSeo   = document.getElementById('settingsPaneSeo');
  if (objArea) objArea.style.display = mode === 'obj' ? '' : 'none';
  if (seoArea) seoArea.style.display = mode === 'seo' ? '' : 'none';
  if (btnObj) { btnObj.style.background = mode === 'obj' ? 'var(--bl)' : 'var(--sf)'; btnObj.style.color = mode === 'obj' ? '#fff' : 'var(--ink2)'; }
  if (btnSeo) { btnSeo.style.background = mode === 'seo' ? 'var(--ac)' : 'var(--sf)'; btnSeo.style.color = mode === 'seo' ? '#fff' : 'var(--ink2)'; }
  if (mode === 'seo') {
    editingSeoTypes = JSON.parse(JSON.stringify(globalSeoTypes));
    renderSeoTypeEditor();
    updateSeoEditorVisibility();
  } else {
    renderTypeList();
    if (editingQTypes.length) selectType(selIdx < editingQTypes.length ? selIdx : 0);
  }
}

function updateSeoEditorVisibility() {
  var editorPanel = document.getElementById('seoEditorPanel');
  var lockedMsg   = document.getElementById('seoLockedMsg');
  if (isMaster()) {
    if (editorPanel) editorPanel.style.display = '';
    if (lockedMsg)   lockedMsg.style.display   = 'none';
  } else {
    if (editorPanel) editorPanel.style.display = 'none';
    if (lockedMsg)   lockedMsg.style.display   = 'flex';
  }
}

function renderSeoTypeEditor() {
  var el = document.getElementById('seoTypeListEl');
  if (!el) return;
  var master = isMaster();
  el.innerHTML = editingSeoTypes.map(function(t, i) {
    var doneChk = master
      ? '<input type="checkbox"' + (t.done ? ' checked' : '') +
          ' onclick="event.stopPropagation();toggleSeoDone(' + i + ')"' +
          ' style="flex-shrink:0;width:15px;height:15px;cursor:pointer;accent-color:var(--gr);" title="프롬프트 완료 표시">'
      : '';
    var selChk = '<input type="checkbox"' + (seoSelected.indexOf(t.id) >= 0 ? ' checked' : '') +
        ' onclick="event.stopPropagation();onSeoTypeEditorSelect(this)"' +
        ' value="' + t.id + '"' +
        ' style="flex-shrink:0;width:15px;height:15px;cursor:pointer;accent-color:var(--bl);" title="서술형 유형 선택">';
    var clickHandler = master ? 'onclick="selectSeoType(' + i + ')"' : '';
    var cursorStyle  = master ? '' : 'cursor:default;';
    return '<div class="ti' + (i===seoSelIdx&&master?' active':'') + '" ' + clickHandler + ' style="display:flex;align-items:center;gap:6px;' + cursorStyle + '">' +
      doneChk + selChk +
      '<div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' +
      '<span class="tname">' + t.name + (t.done ? ' ✓' : '') + '</span></div>';
  }).join('');
}

function onSeoTypeEditorSelect(el) {
  if (el.checked) {
    if (seoSelected.indexOf(el.value) < 0) {
      seoSelected.push(el.value);
      seoCount = seoSelected.length;
      var cntEl = document.getElementById('seoCount');
      if (cntEl) cntEl.textContent = seoCount;
    }
  } else {
    seoSelected = seoSelected.filter(function(s){ return s !== el.value; });
    seoCount = Math.max(1, seoSelected.length);
    var cntEl = document.getElementById('seoCount');
    if (cntEl) cntEl.textContent = seoCount;
  }
  persist();
  // 시험지 구성설정 서술형 포함 토글 목록 동기화
  renderSeoTypeRows();
  // 지문 카드 서술형 드롭다운 실시간 동기화
  renderPassageList();
  var isRand = document.getElementById('randomToggle') && document.getElementById('randomToggle').checked;
  if (!isRand) renderManualCount();
}

var seoSelIdx = 0;

function toggleSeoDone(i) {
  editingSeoTypes[i].done = !editingSeoTypes[i].done;
  var matchId = editingSeoTypes[i].id;
  for (var j = 0; j < globalSeoTypes.length; j++) {
    if (globalSeoTypes[j].id === matchId) { globalSeoTypes[j].done = editingSeoTypes[i].done; break; }
  }
  saveGlobalSeoTypes();
  renderSeoTypeEditor();
  renderPassageList();
}

function selectSeoType(i) {
  seoSelIdx = i;
  renderSeoTypeEditor();
  var t = editingSeoTypes[i];
  var nameEl = document.getElementById('seoEditName');
  var dirEl  = document.getElementById('seoEditDirection');
  var promEl = document.getElementById('seoEditPrompt');
  if (nameEl) nameEl.value = t.name;
  if (dirEl)  dirEl.value  = t.direction || '';
  if (promEl) promEl.value = t.prompt || '';
}

function saveSeoCurrentType() {
  if (!isMaster()) { alert('관리자만 수정할 수 있습니다.'); return; }
  var nameEl = document.getElementById('seoEditName');
  var dirEl  = document.getElementById('seoEditDirection');
  var promEl = document.getElementById('seoEditPrompt');
  if (nameEl) editingSeoTypes[seoSelIdx].name      = nameEl.value;
  if (dirEl)  editingSeoTypes[seoSelIdx].direction = dirEl.value;
  if (promEl) editingSeoTypes[seoSelIdx].prompt    = promEl.value;
  globalSeoTypes = JSON.parse(JSON.stringify(editingSeoTypes));
  saveGlobalSeoTypes();
  renderSeoTypeEditor();
  renderSeoTypeRows();
  alert('서술형 프롬프트가 저장되었습니다.');
}

function switchSettingsCat(cat) {
  settingsCat = cat;
  if (SCHOOL_NAMES.indexOf(cat) >= 0) {
    editingQTypes = mergeWithDefaultQTypes(JSON.parse(JSON.stringify(schoolPresets[cat] || DEFAULT_TYPES)));
  } else if (cat === '기본설정') {
    editingQTypes = JSON.parse(JSON.stringify(DEFAULT_TYPES));
  } else {
    editingQTypes = JSON.parse(JSON.stringify(qTypes));
  }
  selIdx = 0;
  renderSettingsCategoryTabs();
  renderTypeList();
  if (editingQTypes.length) selectType(0);
  renderSettingsEditorVisibility();
  showMasterAdminSection();
}

function renderSettingsCategoryTabs() {
  var el = document.getElementById('settingsCatTabs');
  if (!el) return;
  // 비master: 카테고리 드롭다운 숨김, 개인설정으로 고정
  if (!isMaster()) {
    el.innerHTML = '';
    if (settingsCat !== '개인설정') { settingsCat = '개인설정'; }
    return;
  }
  var schoolOpts = SCHOOL_NAMES.map(function(cat) {
    return '<option value="' + cat + '"' + (cat === settingsCat ? ' selected' : '') + '>🏫 ' + getSchoolLabel(cat) + '</option>';
  }).join('');
  var otherOpts = ['기본설정', '개인설정'].map(function(cat) {
    var icon = cat === '개인설정' ? '👤 ' : '📋 ';
    return '<option value="' + cat + '"' + (cat === settingsCat ? ' selected' : '') + '>' + icon + getSchoolLabel(cat) + '</option>';
  }).join('');
  el.innerHTML = '<select onchange="switchSettingsCat(this.value)" style="font-family:\'Noto Sans KR\',sans-serif;font-size:13px;padding:7px 14px;border:1.5px solid var(--bd2);border-radius:var(--r);background:#fff;color:var(--ink);outline:none;cursor:pointer;font-weight:600;min-width:200px;">'
    + '<optgroup label="🏫 학교별 프롬프트">' + schoolOpts + '</optgroup>'
    + '<optgroup label="⚙️ 기타">' + otherOpts + '</optgroup>'
    + '</select>';
}

function renderSettingsEditorVisibility() {
  var editorEl = document.getElementById('settingsEditorArea');
  var lockedEl = document.getElementById('settingsLockedMsg');
  var promptSetBar = document.getElementById('settingsPromptSetBar');
  var isSchool = SCHOOL_NAMES.indexOf(settingsCat) >= 0;
  var isBasi = settingsCat === '기본설정';

  if (isSchool && !isMaster()) {
    if (editorEl) editorEl.style.display = 'none';
    if (lockedEl) lockedEl.style.display = '';
    if (promptSetBar) promptSetBar.style.display = 'none';
  } else if (isBasi && !isMaster()) {
    if (editorEl) editorEl.style.display = '';
    if (lockedEl) lockedEl.style.display = 'none';
    if (promptSetBar) promptSetBar.style.display = 'none';
    var saveBtn = document.querySelector('#settingsEditorArea .gbtn');
    if (saveBtn) saveBtn.style.display = 'none';
  } else {
    if (editorEl) editorEl.style.display = '';
    if (lockedEl) lockedEl.style.display = 'none';
    if (promptSetBar) promptSetBar.style.display = (settingsCat === '개인설정') ? '' : 'none';
    var saveBtn2 = document.querySelector('#settingsEditorArea .gbtn');
    if (saveBtn2) saveBtn2.style.display = '';
  }
  // 전체 학교 적용 버튼: master 전용
  var allSchoolBtn = document.getElementById('applyAllSchoolsBtn');
  if (allSchoolBtn) allSchoolBtn.style.display = isMaster() ? '' : 'none';
}

// ─── API KEY ───
function isClaudeModel() {
  var m = document.getElementById('modelSelect').value;
  return m.startsWith('claude');
}

function onModelChange() {
  var isClaude = isClaudeModel();
  var label = document.getElementById('apiLabel');
  var input = document.getElementById('apiKeyInput');
  label.textContent = isClaude ? 'Anthropic Key' : 'Gemini Key';
  input.placeholder  = isClaude ? 'sk-ant-...' : 'AIza...';
  // 저장된 키 불러오기
  var savedKey = localStorage.getItem(isClaude ? 'claudeKey' : 'geminiKey') || '';
  input.value = savedKey;
  checkKey();
  saveModel();
}

function checkKey() {
  var key    = document.getElementById('apiKeyInput').value.trim();
  var st     = document.getElementById('keyStatus');
  var isClaude = isClaudeModel();
  var valid  = isClaude
    ? (key.startsWith('sk-ant-') && key.length > 20)
    : (key.startsWith('AIza') && key.length > 20);
  if (valid) {
    st.textContent = '✓ 입력됨'; st.className = 'apist kok';
    localStorage.setItem(isClaude ? 'claudeKey' : 'geminiKey', key);
  } else if (key.length > 0) {
    st.textContent = '형식 확인'; st.className = 'apist kno';
  } else {
    st.textContent = '미입력'; st.className = 'apist kno';
  }
}

// ─── SETTINGS ───
function typeDisplayName(t) {
  return t.name + (t.kichul ? ' (기출)' : '');
}

function renderTypeList() {
  document.getElementById('typeListEl').innerHTML = editingQTypes.map(function(t, i) {
    return '<div class="ti' + (i===selIdx?' active':'') + '" onclick="selectType(' + i + ')">' +
      '<div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' +
      '<span class="tname">' + typeDisplayName(t) + '</span>' +
      '<span class="tcode">' + t.id + '</span></div>';
  }).join('');
}

function selectType(i) {
  selIdx = i;
  renderTypeList();
  var t = editingQTypes[i];
  document.getElementById('editorTitle').textContent  = t.name;
  document.getElementById('editorBadge').className    = 'pebadge ' + COLORS[i % COLORS.length];
  document.getElementById('editName').value           = t.name;
  document.getElementById('editDirection').value      = t.direction;
  document.getElementById('editPrompt').value         = t.prompt;
  var kichulRow = document.getElementById('editKichulRow');
  if (kichulRow) kichulRow.style.display = 'none'; // 기출 체크박스: 객관식 탭에서는 항상 숨김
  var kichulEl = document.getElementById('editKichul');
  if (kichulEl) kichulEl.checked = !!t.kichul;
  if (t.reference && !t.references) {
    _curRefs = [{ name: '레퍼런스.txt', text: t.reference }];
  } else {
    _curRefs = t.references ? JSON.parse(JSON.stringify(t.references)) : [];
  }
  renderRefList();
}

function saveCurrentType() {
  var isSchool = SCHOOL_NAMES.indexOf(settingsCat) >= 0;
  var isBasi = settingsCat === '기본설정';

  if (isSchool && !isMaster()) { alert('관리자만 수정할 수 있습니다.'); return; }
  if (isBasi && !isMaster()) { alert('기본 설정은 관리자만 수정할 수 있습니다.'); return; }

  editingQTypes[selIdx].name      = document.getElementById('editName').value;
  editingQTypes[selIdx].direction = document.getElementById('editDirection').value;
  editingQTypes[selIdx].prompt    = document.getElementById('editPrompt').value;
  editingQTypes[selIdx].references = _curRefs.length ? _curRefs : [];
  editingQTypes[selIdx].reference  = '';
  var kichulEl = document.getElementById('editKichul');
  editingQTypes[selIdx].kichul = kichulEl ? kichulEl.checked : false;

  if (settingsCat === '개인설정') {
    qTypes = JSON.parse(JSON.stringify(editingQTypes));
    loadedPromptSetName = '';
    localStorage.setItem('loadedPromptSetName', '');
    renderActivePromptSet();
    persist(true);
  } else if (isSchool && isMaster()) {
    schoolPresets[settingsCat] = JSON.parse(JSON.stringify(editingQTypes));
    saveSchoolPresets();
    alert('[' + settingsCat + '] 학교 프롬프트가 저장되었습니다.' + (_curRefs.length ? '\n레퍼런스 파일 ' + _curRefs.length + '개도 함께 저장됩니다.' : ''));
    return;
  } else if (isBasi && isMaster()) {
    _originalSetItem.call(localStorage, 'masterDefaultTypes', JSON.stringify(editingQTypes));
  }

  renderTypeList();
  renderQuotaRows();
  alert('저장되었습니다.' + (_curRefs.length ? '\n레퍼런스 파일 ' + _curRefs.length + '개도 함께 저장됩니다.' : ''));
}

function saveTypeToAllSchools() {
  if (!isMaster()) { alert('관리자만 사용할 수 있습니다.'); return; }

  var typeId   = editingQTypes[selIdx].id;
  var newName  = document.getElementById('editName').value;
  var newDir   = document.getElementById('editDirection').value;
  var newProm  = document.getElementById('editPrompt').value;
  var newRefs  = _curRefs.length ? _curRefs : [];
  var kichulEl = document.getElementById('editKichul');
  var newKichul = kichulEl ? kichulEl.checked : false;

  var targets = SCHOOL_NAMES.join(', ');
  if (!confirm('[' + (newName || typeId) + '] 항목의 프롬프트를 모든 학교 설정에 적용합니다.\n\n대상: ' + targets + '\n\n계속하시겠습니까?')) return;

  SCHOOL_NAMES.forEach(function(school) {
    // 학교 프리셋이 없으면 DEFAULT_TYPES 기반으로 초기화
    if (!schoolPresets[school] || !schoolPresets[school].length) {
      schoolPresets[school] = JSON.parse(JSON.stringify(DEFAULT_TYPES));
    }
    var found = false;
    schoolPresets[school].forEach(function(t) {
      if (t.id === typeId) {
        t.name       = newName;
        t.direction  = newDir;
        t.prompt     = newProm;
        t.references = newRefs;
        t.reference  = '';
        t.kichul     = newKichul;
        found = true;
      }
    });
    // 해당 id가 없으면 추가
    if (!found) {
      schoolPresets[school].push({ id: typeId, name: newName, direction: newDir, prompt: newProm, references: newRefs, reference: '', kichul: newKichul });
    }
  });

  saveSchoolPresets();
  alert('[' + (newName || typeId) + '] 항목이 모든 학교(' + SCHOOL_NAMES.length + '개)에 적용·저장되었습니다.');
}

// ─── MASTER ADMIN ───
function isMaster() {
  return sessionStorage.getItem('seumUserId') === MASTER_CODE;
}

function showMasterAdminSection() {
  var sec = document.getElementById('masterAdminSection');
  if (!sec) return;
  if (isMaster()) {
    sec.style.display = '';
    var label = document.getElementById('adminCatLabel');
    if (label) label.textContent = settingsCat;
    document.getElementById('adminMaintainPrompt').value = getTransformPromptForCat(settingsCat, 'maintain');
    document.getElementById('adminChangePrompt').value   = getTransformPromptForCat(settingsCat, 'change');
  } else {
    sec.style.display = 'none';
  }
}

function saveMasterPrompt(mode) {
  if (!isMaster()) return;
  var key = getTransformStorageKey(settingsCat, mode);
  if (mode === 'maintain') {
    var val = document.getElementById('adminMaintainPrompt').value.trim();
    if (!val) { alert('프롬프트가 비어있습니다.'); return; }
    if (val.indexOf('{TEXT}') < 0) { alert('{TEXT} 플레이스홀더가 없습니다. 원본 지문이 삽입될 위치에 {TEXT} 를 추가해주세요.'); return; }
    localStorage.setItem(key, val);
    if (settingsCat === '개인설정' || settingsCat === '기본설정') transformPromptMaintain = val;
    alert('✓ [' + settingsCat + '] 지문 변형(주제유지) 프롬프트가 저장되었습니다.');
  } else {
    var val2 = document.getElementById('adminChangePrompt').value.trim();
    if (!val2) { alert('프롬프트가 비어있습니다.'); return; }
    if (val2.indexOf('{TEXT}') < 0) { alert('{TEXT} 플레이스홀더가 없습니다.'); return; }
    if (val2.indexOf('{DIRECTION}') < 0) { alert('{DIRECTION} 플레이스홀더가 없습니다. 사용자가 입력한 방향이 삽입될 위치에 {DIRECTION} 을 추가해주세요.'); return; }
    localStorage.setItem(key, val2);
    if (settingsCat === '개인설정' || settingsCat === '기본설정') transformPromptChange = val2;
    alert('✓ [' + settingsCat + '] 지문 변형(주제변형) 프롬프트가 저장되었습니다.');
  }
}

function resetTransformPrompt(mode) {
  if (!isMaster()) return;
  if (!confirm('기본값으로 복원하시겠습니까? 현재 편집 내용이 사라집니다.')) return;
  if (mode === 'maintain') {
    localStorage.removeItem(getTransformStorageKey(settingsCat, 'maintain'));
    document.getElementById('adminMaintainPrompt').value = DEFAULT_TRANSFORM_MAINTAIN;
    alert('주제유지 프롬프트가 기본값으로 복원되었습니다.');
  } else {
    localStorage.removeItem(getTransformStorageKey(settingsCat, 'change'));
    document.getElementById('adminChangePrompt').value = DEFAULT_TRANSFORM_CHANGE;
    alert('주제변형 프롬프트가 기본값으로 복원되었습니다.');
  }
}

// ─── PROMPT SETS ───
function persistPromptSets(immediate) {
  localStorage.setItem('promptSets_v1', JSON.stringify(promptSets));
  if (immediate) fbSyncImmediate(); else fbSyncDebounced();
}

function renderPromptSetBar() {
  var keys = Object.keys(promptSets);
  var btnEl = document.getElementById('promptSetButtons');
  var emptyEl = document.getElementById('promptSetEmptyMsg');
  if (!btnEl) return;
  if (!keys.length) {
    btnEl.innerHTML = '';
    emptyEl.style.display = '';
    return;
  }
  emptyEl.style.display = 'none';
  btnEl.innerHTML = keys.map(function(k) {
    return '<div style="display:flex;align-items:center;gap:3px;">' +
      '<button class="setbtn" onclick="loadPromptSet(&quot;' + k + '&quot;)" title="클릭하여 불러오기">📂 ' + k + '</button>' +
      '<button class="setbtn" onclick="deletePromptSet(&quot;' + k + '&quot;)" style="padding:5px 7px;color:var(--er);border-color:#f0c0bb;" title="세트 삭제">✕</button>' +
    '</div>';
  }).join('');
}

function openSavePromptModal() {
  document.getElementById('promptSetNameInput').value = '';
  document.getElementById('savePromptModal').classList.add('open');
  setTimeout(function(){ document.getElementById('promptSetNameInput').focus(); }, 100);
}

function closeSavePromptModal() {
  document.getElementById('savePromptModal').classList.remove('open');
}

function confirmSavePromptSet() {
  var name = document.getElementById('promptSetNameInput').value.trim();
  if (!name) { alert('세트 이름을 입력해주세요.'); return; }
  
  // 프롬프트 세트 저장 시 덩치가 큰 레퍼런스(참조 파일 텍스트)는 제거하여 
  // 기하급수적으로 용량이 부풀어 오르는 현상 방지
  var clonedTypes = JSON.parse(JSON.stringify(qTypes));
  clonedTypes.forEach(function(t) {
    if (t.references) t.references = [];
    if (t.reference) t.reference = '';
  });
  
  promptSets[name] = clonedTypes;
  persistPromptSets(true);
  
  // 방금 저장한 세트를 활성 상태로 변경
  loadedPromptSetName = name;
  localStorage.setItem('loadedPromptSetName', name);
  renderActivePromptSet();
  
  renderPromptSetBar();
  closeSavePromptModal();
  alert('[' + name + '] 프롬프트 세트가 저장되었습니다.');
}

function loadPromptSet(name) {
  if (!confirm('[' + name + '] 세트를 불러오시겠습니까?\n현재 저장되지 않은 프롬프트 설정은 모두 덮어씌워집니다.')) return;
  qTypes = JSON.parse(JSON.stringify(promptSets[name]));
  loadedPromptSetName = name;
  localStorage.setItem('loadedPromptSetName', name);
  persist(true);
  renderTypeList();
  selectType(0);
  renderQuotaRows();
  renderActivePromptSet();
}

function deletePromptSet(name) {
  if (!confirm('[' + name + '] 프롬프트 세트를 삭제하시겠습니까?')) return;
  delete promptSets[name];
  persistPromptSets();
  renderPromptSetBar();
}

// ─── PASSAGES ───
function renderPassageList() {
  document.getElementById('passageCount').textContent = passages.length;
  var el = document.getElementById('passageListEl');
  if (!passages.length) {
    el.innerHTML = '<div class="empty"><div class="eic">📖</div><div class="eti">지문이 없습니다</div><div>"+ 지문 추가" 버튼으로 지문을 입력하세요</div></div>';
    return;
  }
  var isRand = document.getElementById('randomToggle').checked;
  var objTypes = filterObjTypesByCategory(getActiveQTypes());
  var seoTypes = getActiveSeoTypes();
  el.innerHTML = passages.map(function(p, i) {
    var selArea = '';
    if (!isRand) {
      var objOpts = '<option value="unselected"' + ((!p.typeId || p.typeId === 'unselected') ? ' selected' : '') + '>객관식 없음</option>' +
        objTypes.map(function(t) {
          return '<option value="' + t.id + '"' + (p.typeId === t.id ? ' selected' : '') + '>' + t.name + '</option>';
        }).join('');
      // 프롬프트 설정에서 체크박스 체크된 서술형 유형만 표시
      var seoFiltered = seoTypes.filter(function(t) { return seoSelected.indexOf(t.id) >= 0; });
      // 매칭 없으면 전체 표시 (신규 사용자 / seoSelected 미설정)
      if (!seoFiltered.length) seoFiltered = seoTypes.slice();
      var seoOpts = '<option value="unselected"' + ((!p.seoTypeId || p.seoTypeId === 'unselected') ? ' selected' : '') + '>서술형 없음</option>' +
        seoFiltered.map(function(t) {
          return '<option value="' + t.id + '"' + (p.seoTypeId === t.id ? ' selected' : '') + '>' + t.name + '</option>';
        }).join('');
      var objActive = p.typeId && p.typeId !== 'unselected';
      var seoActive = p.seoTypeId && p.seoTypeId !== 'unselected';
      selArea = '<div style="display:flex;gap:4px;align-items:center;">' +
        '<select id="ptsobj-' + i + '" class="ptsel" onchange="setPassageType(' + i + ',this.value)" title="객관식 유형"' +
          (seoActive ? ' disabled style="opacity:0.35;cursor:not-allowed;"' : '') + '>' + objOpts + '</select>' +
        '<select id="ptsseo-' + i + '" class="ptsel" onchange="setPassageSeoType(' + i + ',this.value)" title="서술형 유형"' +
          (objActive ? ' disabled style="opacity:0.35;cursor:not-allowed;"' : ' style="border-color:var(--ac);color:var(--ac);"') + '>' + seoOpts + '</select>' +
        '</div>';
    }
    return '<div class="pc">' +
      '<div class="pchead"><span class="pnum">' + (i+1) + '</span>' +
      '<span style="font-size:13px;font-weight:600;color:var(--ink2);flex:1">' + (p.title||'제목 없음') + '</span>' + selArea + '</div>' +
      '<div class="pprev">' + p.text + '</div>' +
      '<div class="pcfoot" style="flex-wrap:wrap;">' +
      '<button class="mb" onclick="editPassage(' + i + ')">✎ 편집</button>' +
      '<button class="mb" onclick="transformPassage(' + i + ', \'maintain\')" id="btn-tfm-' + i + '">🔄 지문 변형(주제유지)</button>' +
      '<button class="mb" onclick="transformPassage(' + i + ', \'change\')" id="btn-tfc-' + i + '">🔄 지문 변형(주제변형)</button>' +
      '<button class="mb d" onclick="delPassage(' + i + ')">✕ 삭제</button>' +
      '</div></div>';
  }).join('');
}

function updatePassageSelectDisabled(i) {
  var objSel = document.getElementById('ptsobj-' + i);
  var seoSel = document.getElementById('ptsseo-' + i);
  if (!objSel || !seoSel) return;
  var p = passages[i];
  var objActive = p && p.typeId    && p.typeId    !== 'unselected';
  var seoActive = p && p.seoTypeId && p.seoTypeId !== 'unselected';
  // 객관식: 서술형이 선택된 경우 비활성
  objSel.disabled          = !!seoActive;
  objSel.style.opacity     = seoActive ? '0.35' : '';
  objSel.style.cursor      = seoActive ? 'not-allowed' : '';
  // 서술형: 객관식이 선택된 경우 비활성
  seoSel.disabled          = !!objActive;
  seoSel.style.opacity     = objActive ? '0.35' : '';
  seoSel.style.cursor      = objActive ? 'not-allowed' : '';
  seoSel.style.borderColor = objActive ? '' : 'var(--ac)';
  seoSel.style.color       = objActive ? '' : 'var(--ac)';
}

function setPassageSeoType(i, seoTypeId) {
  passages[i].seoTypeId = seoTypeId;
  if (seoTypeId && seoTypeId !== 'unselected') passages[i].typeId = 'unselected';
  persist();
  updatePassageSelectDisabled(i);
  updateQSum();
}

function renderQuotaRows() {
  var aqt = filterObjTypesByCategory(getActiveQTypes());
  document.getElementById('quotaRows').innerHTML = aqt.filter(function(t){
    return !t.id.startsWith('seo');
  }).map(function(t, i) {
    if (quotas[t.id] === undefined) quotas[t.id] = 0;
    return '<div class="qrow">' +
      '<div class="qtype"><div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' + typeDisplayName(t) + '</div>' +
      '<div class="qctrl">' +
      '<button class="qbtn" onclick="chgQ(\'' + t.id + '\',-1)">−</button>' +
      '<div class="qnum" id="q_' + t.id + '">' + quotas[t.id] + '</div>' +
      '<button class="qbtn" onclick="chgQ(\'' + t.id + '\',1)">+</button>' +
      '</div></div>';
  }).join('');
  updateQSum();
}

function renderSeoTypeRows() {
  // 프롬프트 설정에서 체크박스 체크된 유형만 표시 (실시간 동기화)
  var seoTypes = getActiveSeoTypes().filter(function(t) { return seoSelected.indexOf(t.id) >= 0; });
  var el = document.getElementById('seoTypeRows');
  if (!seoTypes.length) {
    el.innerHTML = '<div style="font-size:11px;color:var(--ink3);padding:4px 0;">프롬프트 설정에서 서술형 유형을 먼저 체크하세요.</div>';
    return;
  }
  el.innerHTML = seoTypes.map(function(t) {
    return '<div class="seocbrow">' +
      '<input type="checkbox" id="scb_' + t.id + '" value="' + t.id + '" checked onchange="onSeoCheck(this)">' +
      '<label for="scb_' + t.id + '">' + t.name + '</label></div>';
  }).join('');
}

// renderPsgCards: renderPassageList 별칭 (onSeoCheck 등에서 호출)
function renderPsgCards() { renderPassageList(); }

function chgQ(id, d) {
  quotas[id] = Math.max(0, (quotas[id]||0) + d);
  document.getElementById('q_' + id).textContent = quotas[id];
  updateQSum(); persist();
}

function renderManualCount() {
  var aqt = filterObjTypesByCategory(getActiveQTypes());
  var seoTypes = getActiveSeoTypes();

  // 객관식 카운트
  var objCounts = {};
  aqt.forEach(function(t){ objCounts[t.id] = 0; });
  passages.forEach(function(p){
    var tid = p.typeId;
    if (tid && tid !== 'unselected') {
      if (objCounts[tid] !== undefined) objCounts[tid]++;
      else objCounts[tid] = 1;
    }
  });
  // 서술형 카운트
  var seoCounts = {};
  seoTypes.forEach(function(t){ seoCounts[t.id] = 0; });
  passages.forEach(function(p){
    var sid = p.seoTypeId;
    if (sid && sid !== 'unselected') {
      if (seoCounts[sid] !== undefined) seoCounts[sid]++;
      else seoCounts[sid] = 1;
    }
  });

  // 객관식 rows
  var rows = aqt.map(function(t, i) {
    var n = objCounts[t.id] || 0;
    var bg  = n > 0 ? 'var(--grs)' : 'var(--sf2)';
    var col = n > 0 ? 'var(--gr)'  : 'var(--ink3)';
    var op  = n > 0 ? '' : 'opacity:0.45;';
    return '<div class="qrow" style="' + op + '">' +
      '<div class="qtype"><div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' + t.name + '</div>' +
      '<div class="qctrl"><div class="qnum" style="min-width:28px;text-align:center;background:' + bg + ';border-radius:3px;padding:2px 6px;border:1px solid var(--bd);color:' + col + ';font-weight:700;">' + n + '</div></div></div>';
  }).join('');

  // 서술형 rows
  var activeSeoRows = seoTypes.filter(function(t){ return seoCounts[t.id] > 0; });
  if (activeSeoRows.length) {
    rows += '<div style="margin:10px 0 5px;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--ac);">[서술형] 배정 현황</div>';
    activeSeoRows.forEach(function(t, i) {
      var n = seoCounts[t.id] || 0;
      rows += '<div class="qrow" style="border-color:#f0c0bb;">' +
        '<div class="qtype"><div class="tdot ' + COLORS[(aqt.length + i) % COLORS.length] + '"></div>' + t.name + '</div>' +
        '<div class="qctrl"><div class="qnum" style="min-width:28px;text-align:center;background:var(--acs);border-radius:3px;padding:2px 6px;border:1px solid #f0c0bb;color:var(--ac);font-weight:700;">' + n + '</div></div></div>';
    });
  }

  document.getElementById('manualCountRows').innerHTML = rows;
}

function updateQSum() {
  var isRand = document.getElementById('randomToggle').checked;
  var total;
  if (isRand) {
    total = Object.values(quotas).reduce(function(s,v){ return s+v; }, 0);
  } else {
    var objCount = passages.filter(function(p){ return p.typeId && p.typeId !== 'unselected'; }).length;
    var seoCount2 = passages.filter(function(p){ return p.seoTypeId && p.seoTypeId !== 'unselected'; }).length;
    total = objCount + seoCount2;
  }
  document.getElementById('quotaSummary').textContent = '총 ' + total + '문항 · 지문 ' + passages.length + '개 입력됨';
  if (!isRand) renderManualCount();
}

function onRandomToggle() {
  var isRand = document.getElementById('randomToggle').checked;
  document.getElementById('quotaSection').style.display        = isRand ? '' : 'none';
  document.getElementById('manualCountSection').style.display  = isRand ? 'none' : '';
  document.getElementById('seoToggleRow').style.display        = isRand ? '' : 'none';
  if (!isRand) {
    // 랜덤 OFF: 서술형 토글 OFF로 초기화
    document.getElementById('seoToggle').checked = false;
    document.getElementById('seoSection').style.display = 'none';
    renderManualCount();
  }
  renderPassageList(); updateQSum();
}

function onSeoToggle() {
  var on = document.getElementById('seoToggle').checked;
  document.getElementById('seoSection').style.display = on ? '' : 'none';
  var isRand = document.getElementById('randomToggle').checked;
  if (!isRand) renderManualCount();
}

function chgSeoCount(d) {
  var maxCount = Math.max(1, seoSelected.length);
  seoCount = Math.max(1, Math.min(maxCount, seoCount + d));
  document.getElementById('seoCount').textContent = seoCount;
  renderSetBar();
  renderHistory();
  loadReportsFromSheets();
  initReportQtype();
  persist();
  var isRand = document.getElementById('randomToggle').checked;
  if (!isRand) renderManualCount();
}

function onSeoCheck(el) {
  if (el.checked) {
    // 중복 체크 방지
    if (seoSelected.indexOf(el.value) < 0) {
      seoSelected.push(el.value);
      // 체크된 수에 맞게 seoCount 자동 동기화
      seoCount = seoSelected.length;
      document.getElementById('seoCount').textContent = seoCount;
    }
  } else {
    seoSelected = seoSelected.filter(function(s){ return s !== el.value; });
    // 체크 해제 시에도 seoCount 동기화
    seoCount = Math.max(1, seoSelected.length);
    document.getElementById('seoCount').textContent = seoCount;
  }
  persist();
  // 프롬프트 설정 탭의 서술형 유형 목록도 실시간 동기화
  renderSeoTypeEditor();
  // 시험지 구성설정 서술형 포함 토글 목록 실시간 동기화
  renderSeoTypeRows();
  // 시험지 구성 사이드바 서술형 드롭다운 실시간 동기화
  renderPsgCards();
  var isRand = document.getElementById('randomToggle').checked;
  if (!isRand) renderManualCount();
}

function openModal() {
  editIdx = -1;
  document.getElementById('modalTitle').textContent = '지문 추가';
  document.getElementById('mTitle').value = '';
  document.getElementById('mText').value  = '';
  document.getElementById('addModal').classList.add('open');
}

function editPassage(i) {
  editIdx = i;
  document.getElementById('modalTitle').textContent = '지문 편집';
  document.getElementById('mTitle').value = passages[i].title || '';
  document.getElementById('mText').value  = passages[i].text  || '';
  document.getElementById('addModal').classList.add('open');
}

function closeModal() { document.getElementById('addModal').classList.remove('open'); }

function savePassage() {
  var title = document.getElementById('mTitle').value.trim();
  var text  = document.getElementById('mText').value.trim();
  if (!text) { alert('지문을 입력해주세요.'); return; }
  var defType = getActiveQTypes().length ? getActiveQTypes()[0].id : '';
  if (editIdx >= 0) {
    passages[editIdx] = { title:title, text:text, typeId: passages[editIdx].typeId || defType };
  } else {
    passages.push({ title:title, text:text, typeId: defType });
  }
  persist(); renderPassageList(); updateQSum(); closeModal();
}

function delPassage(i) {
  passages.splice(i,1); persist(); renderPassageList(); updateQSum();
}

// ─── PASSAGE SETS ───
var passageSets = JSON.parse(localStorage.getItem('passageSets') || '{}');
var loadedSetName = '';

function persistSets() {
  localStorage.setItem('passageSets', JSON.stringify(passageSets));
  fbSyncDebounced();
}

function renderSetBar() {
  var keys = Object.keys(passageSets);
  var btnEl = document.getElementById('setButtons');
  var emptyEl = document.getElementById('setEmptyMsg');
  if (!keys.length) {
    btnEl.innerHTML = '';
    emptyEl.style.display = '';
    return;
  }
  emptyEl.style.display = 'none';
  btnEl.innerHTML = keys.map(function(k) {
    return '<div style="display:flex;align-items:center;gap:3px;">' +
      '<button class="setbtn" onclick="loadSet(&quot;' + k + '&quot;)" title="클릭하여 불러오기">📂 ' + k + ' (' + passageSets[k].length + ')</button>' +
      '<button class="setbtn" onclick="renameSet(&quot;' + k + '&quot;)" style="padding:5px 7px;color:#f39c12;border-color:#fce4bd;" title="이름 수정">✏️</button>' +
      '<button class="setbtn" onclick="deleteSet(&quot;' + k + '&quot;)" style="padding:5px 7px;color:var(--ac);border-color:#f0c0bb;" title="세트 삭제">✕</button>' +
    '</div>';
  }).join('');
}

function openSaveSetModal() {
  if (!passages.length) { alert('저장할 지문이 없습니다.'); return; }
  document.getElementById('setNameInput').value = loadedSetName || '';
  document.getElementById('setCountPreview').textContent = passages.length;
  document.getElementById('saveSetModal').classList.add('open');
  setTimeout(function(){ document.getElementById('setNameInput').focus(); }, 100);
}

function closeSaveSetModal() {
  document.getElementById('saveSetModal').classList.remove('open');
}

function confirmSaveSet() {
  var name = document.getElementById('setNameInput').value.trim();
  if (!name) { alert('세트 이름을 입력해주세요.'); return; }
  passageSets[name] = JSON.parse(JSON.stringify(passages));
  loadedSetName = name;
  persistSets();
  renderSetBar();
  closeSaveSetModal();
  alert('[' + name + '] 세트로 저장되었습니다. (' + passages.length + '개 지문)');
}

function loadSet(name) {
  if (!passageSets[name]) return;
  if (passages.length && !confirm('[' + name + '] 세트를 불러오면 현재 지문이 교체됩니다. 계속하시겠습니까?')) return;
  passages = JSON.parse(JSON.stringify(passageSets[name]));
  loadedSetName = name;
  persist(); renderPassageList(); updateQSum();
}

function renameSet(oldName) {
  var newName = prompt('[' + oldName + '] 세트의 새로운 이름을 입력하세요:', oldName);
  if (!newName) return;
  newName = newName.trim();
  if (!newName || newName === oldName) return;
  if (passageSets[newName]) {
    if (!confirm('이미 [' + newName + '] 세트가 존재합니다. 덮어쓰시겠습니까?')) return;
  }
  passageSets[newName] = passageSets[oldName];
  delete passageSets[oldName];
  if (loadedSetName === oldName) loadedSetName = newName;
  persistSets();
  renderSetBar();
}

function deleteSet(name) {
  if (!confirm('[' + name + '] 세트를 삭제하시겠습니까?')) return;
  delete passageSets[name];
  if (loadedSetName === name) loadedSetName = '';
  persistSets();
  renderSetBar();
}

function savePassages() {
  persist();
}

function clearAllPassages() {
  if (!passages.length) { alert('지문이 없습니다.'); return; }
  if (!confirm('모든 지문을 지우고 새로 입력하시겠습니까?')) return;
  passages = [];
  loadedSetName = '';
  persist(); renderPassageList(); updateQSum();
}

function resetAllPassageTypes() {
  if (!passages.length) { alert('지문이 없습니다.'); return; }
  if (!confirm('모든 지문의 선택된 유형을 미선택으로 초기화하시겠습니까?')) return;
  passages.forEach(function(p) { p.typeId = 'unselected'; p.seoTypeId = 'unselected'; });
  persist(); renderPassageList(); updateQSum();
  var isRand = document.getElementById("randomToggle").checked;
  if (!isRand) renderManualCount();
}

async function transformPassage(i, mode) {
  var key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('상단에 API 키를 입력해주세요.'); return; }
  
  var btn1 = document.getElementById('btn-tfm-' + i);
  var btn2 = document.getElementById('btn-tfc-' + i);
  var text = passages[i].text;
  
  var modeTitle, promptText;
  if (mode === 'maintain') {
    modeTitle = '주제유지';
    promptText = getTransformPromptForCat(activeCategory, 'maintain').replace('{TEXT}', text);
  } else {
    modeTitle = '주제변형';
    var userDirection = prompt('새로운 주제의 방향을 입력하세요 (선택 사항)\n(예: 기술적 관점에서 긍정적인 내용으로 써 줘. / 입력하지 않으면 AI가 임의로 변경합니다.)', '');
    if (userDirection === null) return; // 취소 버튼

    var directionStr = userDirection.trim() ? ("\n\n[새로운 주제의 방향]\n" + userDirection.trim()) : "\n\n[새로운 주제의 방향]\n(AI가 임의의 다른 관점으로 작성함)";
    promptText = getTransformPromptForCat(activeCategory, 'change').replace('{DIRECTION}', directionStr).replace('{TEXT}', text);
  }
  
  if (!confirm('[' + (passages[i].title||'지문') + '] 지문을 \'' + modeTitle + '\' 방식으로 변형하시겠습니까?\n변형된 지문은 원본 바로 아래에 새롭게 추가됩니다.')) return;
  
  if (btn1) btn1.disabled = true;
  if (btn2) btn2.disabled = true;
  var oldBtnHTML = mode === 'maintain' ? btn1.innerHTML : btn2.innerHTML;
  if (btn1 && mode === 'maintain') btn1.innerHTML = '🔄 변형 중...';
  if (btn2 && mode === 'change') btn2.innerHTML = '🔄 변형 중...';

  try {
    var model = document.getElementById('modelSelect').value;
    var resultText = '';
    
    if (model.startsWith('claude')) {
      var res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4000,
          messages: [{ role: 'user', content: promptText }]
        })
      });
      if (!res.ok) {
        var errObj = await res.json().catch(function(){ return {}; });
        throw new Error(errObj.error && errObj.error.message ? errObj.error.message : 'HTTP ' + res.status);
      }
      var data = await res.json();
      resultText = data.content && data.content[0] ? data.content[0].text : '';
    } else {
      var res2 = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            contents:[{parts:[{text: promptText}]}],
            generationConfig:{maxOutputTokens:4000, temperature:0.7}
          })
        }
      );
      if (!res2.ok) {
        var errObj2 = await res2.json().catch(function(){ return {}; });
        throw new Error(errObj2.error && errObj2.error.message ? errObj2.error.message : 'HTTP ' + res2.status);
      }
      var data2 = await res2.json();
      resultText = (data2.candidates && data2.candidates[0] && data2.candidates[0].content &&
        data2.candidates[0].content.parts && data2.candidates[0].content.parts[0])
        ? data2.candidates[0].content.parts[0].text : '';
    }
    
    if (resultText) {
      passages.splice(i + 1, 0, {
        title: (passages[i].title || '지문') + ' (변형:' + modeTitle + ')',
        text: resultText.trim(),
        typeId: passages[i].typeId || 'unselected'
      });
      persist();
      renderPassageList();
      updateQSum();
    } else {
      throw new Error('반환된 텍스트가 없습니다.');
    }
    
  } catch(e) {
    console.error(e);
    alert('변형 중 오류가 발생했습니다: ' + e.message);
    if (btn1) { btn1.disabled = false; btn1.innerHTML = '🔄 지문 변형(주제유지)'; }
    if (btn2) { btn2.disabled = false; btn2.innerHTML = '🔄 지문 변형(주제변형)'; }
  }
}

function setPassageType(i, typeId) {
  passages[i].typeId = typeId;
  if (typeId && typeId !== 'unselected') passages[i].seoTypeId = 'unselected';
  persist();
  updatePassageSelectDisabled(i);
  updateQSum();
  var isRand = document.getElementById("randomToggle").checked;
  if (!isRand) renderManualCount();
}

// ─── 유형별 고정 출력 형식 (사용자 편집 불가 / 자동 추가) ───
var FIXED_FORMAT = {};

function getFixedFormat(typeId) {
  return '';
}

// ─── GENERATION ───
var _genCancelled = false;

function cancelGeneration() {
  _genCancelled = true;
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('generateBtn').disabled = false;
  var pracBtn = document.getElementById('pracGenerateBtn');
  if (pracBtn) pracBtn.disabled = false;
  var pbWrap = document.getElementById('pbWrap');
  if (pbWrap) pbWrap.classList.remove('pulse-glow');
  var lbl = document.getElementById('pbLabel');
  if (lbl) lbl.textContent = '취소됨';
}

function wait(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }

// Claude가 섹션 키 앞에 추론 텍스트를 출력하는 경우 제거
function stripLeadingProse(raw) {
  var m = raw.match(/(?:^|\n)([ \t]*[A-Z][A-Z_]{2,}[ \t]*:)/);
  if (m && raw.indexOf(m[1]) > 0) return raw.substring(raw.indexOf(m[1])).trimStart();
  return raw;
}

var SEC_LABELS = ['PASSAGE','INTRO','BLOCK_A','BLOCK_B','BLOCK_C','GIVEN_SENTENCE','SUMMARY','DIRECTION','QUESTION','CHOICES','ANSWER','EXPLANATION','MODEL_ANSWER','CONDITIONS','WORD_BANK','TARGETS','UNDERLINE','DIRECTION_TOPIC','CONDITIONS_TOPIC','MODEL_ANSWER_TOPIC','DIRECTION_Q1','CONDITIONS_Q1','MODEL_ANSWER_Q1','DIRECTION_Q2','CONDITIONS_Q2','MODEL_ANSWER_Q2','PASSAGE_A','PASSAGE_B','DIRECTION_1','DIRECTION_2','MODEL_ANSWER_A','MODEL_ANSWER_B','MODEL_ANSWER_1','MODEL_ANSWER_2','TRANSFORMED_PASSAGE','TRANSFORM_REPORT','Q1_DIRECTION','Q1_TABLE','Q1_ANSWER','Q1_INTENT','Q2_DIRECTION','Q2_UNDERLINE_MAP','Q2_ANSWER','Q2_EXPLANATION','Q2_DISTRACTOR','BLOCK_D','ORDER_DIRECTION','ORDER_CHOICES','ORDER_ANSWER','MATCH_DIRECTION','MATCH_CHOICES','MATCH_ANSWER','CONTENT_MATCH_DIRECTION','CONTENT_MATCH_CHOICES','CONTENT_MATCH_ANSWER','GRAMMAR_DIRECTION','GRAMMAR_CHOICES','GRAMMAR_ANSWER','REF_DIRECTION','REF_ANSWER','TITLE_DIRECTION','TITLE_CHOICES','TITLE_ANSWER'];

// Gemini 등이 라벨에 마크다운(**굵게**, ## 머리글, - 목록)을 붙이거나 콜론을 빠뜨려도
// 파싱되도록, 알려진 섹션 라벨 줄을 표준형 "LABEL:" 으로 정규화한다.
function normalizeLabels(raw) {
  if (!raw) return raw;
  var alt = SEC_LABELS.join('|');
  var reInline = new RegExp('^[ \\t]*[#>\\-]*[ \\t]*\\*{0,2}(' + alt + ')\\*{0,2}[ \\t]*:[ \\t]*\\*{0,2}[ \\t]*');
  var reAlone  = new RegExp('^[ \\t]*[#>\\-]*[ \\t]*\\*{0,2}(' + alt + ')\\*{0,2}[ \\t]*:?[ \\t]*\\*{0,2}[ \\t]*$');
  return raw.split('\n').map(function(line){
    var mi = line.match(reInline);
    if (mi) return mi[1] + ': ' + line.slice(mi[0].length);
    var ma = line.match(reAlone);
    if (ma) return ma[1] + ':';
    return line;
  }).join('\n');
}

function extractSec(raw, key) {
  var src = normalizeLabels(raw);
  var m = src.match(new RegExp('(?:^|\\n)[ \\t]*' + key + ':[ \\t]*([\\s\\S]*?)(?=\\n[ \\t]*[A-Z][A-Z0-9_]*[ \\t]*:|$)', 'i'));
  return m ? m[1].trim() : '';
}

// 콜론 없는 한국어 섹션 헤더 (< 조건 >, < 보기 >) 추출.
// 줄 단독으로 놓인 표준 헤더만 인식하고, "주어진 <조건>에 맞게..." 같은
// 문장 내 인라인 토큰은 무시한다.
function extractKorBlock(text, header) {
  var label = header.replace(/[<>()\[\]\s]/g, ''); // "조건" 또는 "보기"
  var stopPat = '(?=(?:^|\\n)[ \\t]*<\\s*(?:조건|보기)\\s*>|(?:^|\\n)[ \\t]*답\\s*[:：]|MODEL_ANSWER|EXPLANATION|$)';
  var re = new RegExp('(?:^|\\n)[ \\t]*<\\s*' + label + '\\s*>[ \\t]*\\n([\\s\\S]*?)' + stopPat, 'i');
  var m = text.match(re);
  return m ? m[1].replace(/답\s*[:：][\s_]*/g, '').trim() : '';
}

// 서술형 지시문 정리: 답란/표준 <조건>·<보기> 헤더 줄에서 끊되,
// "다음 <조건>에 맞게..." 처럼 문장 안에 인라인으로 박힌 토큰에서는 자르지 않는다.
function cleanSeoInstruction(direction) {
  var lines = (direction || '').split('\n');
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (/^\s*<?\s*(조건|보기)\s*>?\s*$/.test(ln)) break; // 단독 헤더 줄
    if (/^\s*답\s*[:：]/.test(ln)) break;                 // 답란 줄
    out.push(ln);
  }
  return out.join('\n').replace(/답\s*[:：][\s_]*$/, '').trim();
}

// 답란 빈칸 라벨 판정: SUMMARY/MODEL_ANSWER의 (A)(B)(C)... 마커로 빈칸 개수를 결정.
// 마커가 2개 이상이면 다중 빈칸형(요약완성), 아니면 단일 문장형으로 렌더링한다.
function detectBlankLabels(summary, modelAns) {
  var src = (summary || '') + '\n' + (modelAns || '');
  var found = [], re = /\(([A-E])\)/g, m;
  while ((m = re.exec(src))) { if (found.indexOf(m[1]) < 0) found.push(m[1]); }
  return found;
}

function toSections(num, type, raw, passageTitle) {
  if (!raw) return { q:'[' + num + '번 생성 실패]\n\n', a:'' };
  raw = stripLeadingProse(raw);
  var passage  = extractSec(raw,'PASSAGE') || extractSec(raw,'INTRO') || '';
  var intro    = extractSec(raw,'INTRO')   || '';
  var bA       = extractSec(raw,'BLOCK_A') || '';
  var bB       = extractSec(raw,'BLOCK_B') || '';
  var bC       = extractSec(raw,'BLOCK_C') || '';
  var given    = extractSec(raw,'GIVEN_SENTENCE') || '';
  var summary  = extractSec(raw,'SUMMARY')  || '';
  // QUESTION: 을 DIRECTION: 의 별칭으로 지원
  var direction= extractSec(raw,'DIRECTION') || extractSec(raw,'QUESTION') || type.direction;
  var choices  = (extractSec(raw,'CHOICES')||'').split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
  var answer   = extractSec(raw,'ANSWER')   || '';
  var expl     = extractSec(raw,'EXPLANATION') || '';
  var modelAns = extractSec(raw,'MODEL_ANSWER') || answer || '';
  // CONDITIONS: / WORD_BANK: 섹션 지원 (사용자 정의 서술형 포맷)
  var conditionsBlock = extractSec(raw,'CONDITIONS') || '';
  var wordBankBlock   = extractSec(raw,'WORD_BANK')  || '';
  // 서술형1 특수 섹션
  var condSec  = extractSec(raw,'< 조건 >') || extractSec(raw,'조건') || '';
  var exampleSec = extractSec(raw,'< 보기 >') || extractSec(raw,'보기') || '';
  var DIV = '\u2500'.repeat(60);

  var hasContent = !!(passage || intro || bA || given || summary);
  // seo 유형 및 content_grammar는 고정 렌더 블록이 따로 있으므로 hasContent 폴백을 건너뜀
  if (!hasContent && (type.seoRender || (type.id && type.id.startsWith('seo')) || type.id === 'content_grammar' || type.id === 'ref_title')) {
    hasContent = true;
  }
  if (!choices.length) {
    choices = raw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
  }

  // ── 문제부 ──
  var q = [];
  q.push('[' + num + '번] [' + type.name + ']' + (passageTitle ? ' (' + passageTitle + ')' : '')); q.push('');

  if (!hasContent) {
    // 파싱 실패 폴백
    var cutIdx = raw.length;
    var cutKeys = ['ANSWER:', 'EXPLANATION:', 'MODEL_ANSWER:', '해석', '해설', '선지 해석'];
    for (var ci=0; ci<cutKeys.length; ci++) {
      var ki = raw.indexOf(cutKeys[ci]);
      if (ki > 0 && ki < cutIdx) cutIdx = ki;
    }
    var hanRe = new RegExp('[\uAC00-\uD7A3]');
    q.push(direction); q.push('');
    var cleaned = raw.slice(0, cutIdx).split('\n').filter(function(l){
      return !hanRe.test(l);
    }).join('\n').trim();
    q.push(cleaned);

  } else if (type.id === 'implication') {
    // 함의추론: UNDERLINE 섹션 → DIRECTION에 구문 삽입
    var ulPhrase = extractSec(raw, 'UNDERLINE') || '';
    // UNDERLINE 없으면 PASSAGE에서 *표시* 추출
    if (!ulPhrase) {
      var ulMatch = passage.match(/[_*]{1,2}([^_*]+)[_*]{1,2}/);
      ulPhrase = ulMatch ? ulMatch[1].trim() : '';
    }
    // DIRECTION에 구문이 이미 포함돼 있으면 그대로, 없으면 구문 삽입
    var implDir = direction;
    if (ulPhrase && direction.indexOf(ulPhrase) < 0) {
      implDir = '밑줄 친 ' + ulPhrase + ' 이/가 다음 글에서 의미하는 바로 가장 적절한 것은?';
    }
    q.push(implDir); q.push('');
    if (passage) { q.push(passage); q.push(''); }
    choices.forEach(function(c){ q.push(c); }); q.push('');

  } else if (type.id === 'order') {
    q.push(direction); q.push('');
    if (intro) { q.push('주어진 글:'); q.push(intro); q.push(''); }
    if (bA) { q.push(bA); q.push(''); }
    if (bB) { q.push(bB); q.push(''); }
    if (bC) { q.push(bC); q.push(''); }
    choices.forEach(function(c){ q.push(c); }); q.push('');

  } else if (type.id === 'order_match') {
    // 청덕2_순서+내용일치: (A)(B)(C)(D) 4단락 + 순서 문제 + 내용일치 문제
    var omA = extractSec(raw, 'BLOCK_A') || bA || '';
    var omB = extractSec(raw, 'BLOCK_B') || bB || '';
    var omC = extractSec(raw, 'BLOCK_C') || bC || '';
    var omD = extractSec(raw, 'BLOCK_D') || '';
    var omOrdDir   = extractSec(raw, 'ORDER_DIRECTION') || '주어진 글 (A)에 이어질 내용을 순서에 맞게 배열한 것으로 가장 적절한 것은?';
    var omOrdRaw   = extractSec(raw, 'ORDER_CHOICES') || '';
    var omOrdChoices = omOrdRaw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
    var omOrdAns   = extractSec(raw, 'ORDER_ANSWER') || '';
    var omMatDir   = extractSec(raw, 'MATCH_DIRECTION') || '윗글에 관한 내용으로 적절하지 않은 것은?';
    var omMatRaw   = extractSec(raw, 'MATCH_CHOICES') || '';
    var omMatChoices = omMatRaw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
    var omMatAns   = extractSec(raw, 'MATCH_ANSWER') || '';

    // 공통 지시문 + 4단락
    q.push('다음 글을 읽고, 물음에 답하시오.'); q.push('');
    if (omA) { q.push(omA); q.push(''); }
    if (omB) { q.push(omB); q.push(''); }
    if (omC) { q.push(omC); q.push(''); }
    if (omD) { q.push(omD); q.push(''); }

    // 순서 문제
    q.push(omOrdDir); q.push('');
    if (omOrdChoices.length) { omOrdChoices.forEach(function(c){ q.push(c); }); }
    else { q.push('① (B)-(C)-(D)'); q.push('② (B)-(D)-(C)'); q.push('③ (C)-(B)-(D)'); q.push('④ (C)-(D)-(B)'); q.push('⑤ (D)-(B)-(C)'); }
    q.push('');

    // 내용일치 문제
    q.push(omMatDir); q.push('');
    omMatChoices.forEach(function(c){ q.push(c); }); q.push('');

    // 교사용 정답 키
    if (omOrdAns || omMatAns) {
      modelAns = (omOrdAns ? '순서: ' + omOrdAns + '\n' : '') + (omMatAns ? '내용일치: ' + omMatAns : '');
    }

  } else if (type.id === 'content_grammar') {
    // 청덕2_내용일치+어법: 변형 지문 + 내용일치 문제 + 어법 선택 문제
    var cgPassage   = extractSec(raw, 'TRANSFORMED_PASSAGE') || passage || '';
    var cgCmDir     = extractSec(raw, 'CONTENT_MATCH_DIRECTION') || '윗글의 내용과 일치하는 것은?';
    var cgCmRaw     = extractSec(raw, 'CONTENT_MATCH_CHOICES') || '';
    var cgCmChoices = cgCmRaw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
    var cgCmAns     = extractSec(raw, 'CONTENT_MATCH_ANSWER') || '';
    var cgGrDir     = extractSec(raw, 'GRAMMAR_DIRECTION') || '윗글의 각 괄호 안에서 어법상 맞는 것을 짝지은 것은?';
    var cgGrRaw     = extractSec(raw, 'GRAMMAR_CHOICES') || '';
    // (A) - (B) - (C) 헤더 라인 별도 추출
    var cgGrHeader  = (cgGrRaw.split('\n').filter(function(l){ return l.trim() && !l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); })[0] || '').trim();
    var cgGrChoices = cgGrRaw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
    var cgGrAns     = extractSec(raw, 'GRAMMAR_ANSWER') || '';

    // 공통 지시문 + 변형 지문 (passageTitle 포함)
    q.push('다음 글을 읽고, 물음에 답하시오.' + (passageTitle ? ' (' + passageTitle + ')' : '')); q.push('');
    if (cgPassage) { q.push(cgPassage); q.push(''); }

    // 내용일치 문제
    q.push(cgCmDir); q.push('');
    cgCmChoices.forEach(function(c){ q.push(c); }); q.push('');

    // 어법 선택 문제
    q.push(cgGrDir); q.push('');
    if (cgGrHeader) { q.push(cgGrHeader); q.push(''); }
    cgGrChoices.forEach(function(c){ q.push(c); }); q.push('');

    // 교사용 정답 키
    if (cgCmAns || cgGrAns) {
      modelAns = (cgCmAns ? '내용일치: ' + cgCmAns + '\n' : '') + (cgGrAns ? '어법: ' + cgGrAns : '');
    }

  } else if (type.id === 'ref_title') {
    // 청덕2_지칭추론+제목: 변형 지문 + 지칭 추론 + 제목 문제
    var rtPassage     = extractSec(raw, 'TRANSFORMED_PASSAGE') || passage || '';
    var rtRefDir      = extractSec(raw, 'REF_DIRECTION') || '밑줄 친 (a)~(e) 중에서 가리키는 대상이 나머지 넷과 다른 것은?';
    var rtRefAns      = extractSec(raw, 'REF_ANSWER') || '';
    var rtTitleDir    = extractSec(raw, 'TITLE_DIRECTION') || '윗글의 제목으로 가장 적절한 것은?';
    var rtTitleRaw    = extractSec(raw, 'TITLE_CHOICES') || '';
    var rtTitleChoices = rtTitleRaw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/); });
    var rtTitleAns    = extractSec(raw, 'TITLE_ANSWER') || '';

    // 공통 지시문 + 변형 지문
    q.push('다음 글을 읽고, 물음에 답하시오.' + (passageTitle ? ' (' + passageTitle + ')' : '')); q.push('');
    if (rtPassage) { q.push(rtPassage); q.push(''); }

    // 지칭추론 문제 (선택지 고정)
    q.push(rtRefDir); q.push('');
    q.push('① (a)  ② (b)  ③ (c)  ④ (d)  ⑤ (e)'); q.push('');

    // 제목 문제
    q.push(rtTitleDir); q.push('');
    rtTitleChoices.forEach(function(c){ q.push(c); }); q.push('');

    // 교사용 정답 키
    if (rtRefAns || rtTitleAns) {
      modelAns = (rtRefAns ? '지칭추론: ' + rtRefAns + '\n' : '') + (rtTitleAns ? '제목: ' + rtTitleAns : '');
    }

  } else if (type.id === 'insert') {
    q.push(direction); q.push('');
    if (given)   { q.push('주어진 문장: ' + given); q.push(''); }
    if (passage) { q.push(passage); q.push(''); }
    choices.forEach(function(c){ q.push(c); }); q.push('');

  } else if (type.id === 'summary') {
    q.push(direction.replace(/답\s*[:：][\s_]*/g, '').trim()); q.push('');
    if (passage) { q.push(passage); q.push(''); }
    if (summary) { q.push('요약: ' + summary); q.push(''); }
    choices.forEach(function(c){ q.push(c); }); q.push('');

  } else if (type.id.startsWith('seo') || type.seoRender) {
    // ── 서술형 렌더링: seoRender 필드 기반 고정 렌더 ──
    var seoCond2 = conditionsBlock || extractKorBlock(direction + '\n' + summary, '< 조건 >');
    var seoBank2 = wordBankBlock   || extractKorBlock(direction + '\n' + summary, '< 보기 >');
    var sumClean2 = cleanSeoInstruction(summary);
    var dirClean2 = cleanSeoInstruction(direction) || direction.trim();
    var seoRender = type.seoRender || '';

    if (seoRender === 'topic') {
      // 지문 → 지시문 → < 조건 > → < 보기 > → 답란 1개
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      if (seoBank2) { q.push('< 보기 >'); q.push(seoBank2); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');

    } else if (seoRender === 'summary4') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (sumClean2) { q.push(sumClean2); q.push(''); }
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('(A) : ____________________');
      q.push('(B) : ____________________');
      q.push('(C) : ____________________');
      q.push('(D) : ____________________'); q.push('');

    } else if (seoRender === 'summary3') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (sumClean2) { q.push(sumClean2); q.push(''); }
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('답 : (A) ____________________');
      q.push('답 : (B) ____________________');
      q.push('답 : (C) ____________________'); q.push('');

    } else if (seoRender === 'summary2') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (sumClean2) { q.push(sumClean2); q.push(''); }
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('답 : (A) ____________________');
      q.push('답 : (B) ____________________'); q.push('');

    } else if (seoRender === 'blanks') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');

    } else if (seoRender === 'compose') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');

    } else if (seoRender === 'content') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      q.push('답 : _________________________________________________'); q.push('');

    } else if (seoRender === 'grammar') {
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('틀린 표현: _______________  →  바른 표현: _______________'); q.push('');

    } else if (seoRender === 'ext_passage') {
      var epPassA = extractSec(raw, 'PASSAGE_A')      || '';
      var epPassB = extractSec(raw, 'PASSAGE_B')      || '';
      var epBank  = extractSec(raw, 'WORD_BANK')      || wordBankBlock || '';
      var epMaA   = extractSec(raw, 'MODEL_ANSWER_A') || '';
      var epMaB   = extractSec(raw, 'MODEL_ANSWER_B') || '';

      // 전체 지시
      q.push(dirClean2); q.push('');

      // (A) 지문
      if (epPassA) { q.push('(A)'); q.push(''); q.push(epPassA); q.push(''); }

      // (B) 지문 (빈칸 포함)
      if (epPassB) { q.push('(B)'); q.push(''); q.push(epPassB); q.push(''); }

      // (1) 한국어 요지 — 고정 지시문 + 답란
      q.push('(1) 윗글 (A)의 요지를 한 문장의 우리말로 적으시오.'); q.push('');
      q.push('_______________________________________________'); q.push('');

      // (2) 보기 단어 빈칸 완성 — 고정 지시문, 빈칸은 이미 (B)에 있음
      q.push('(2) 윗글 (B)의 빈칸에 들어갈 말을 <보기>에 주어진 단어를 한 번씩만 모두 사용하여 완성하시오.'); q.push('');
      if (epBank) { q.push('< 보기 >'); q.push(epBank); q.push(''); }

      // 정답 (교사용 키) — modelAns만, EXPLANATION 미포함
      if (epMaA || epMaB) {
        modelAns = (epMaA ? '(1) ' + epMaA + '\n' : '') + (epMaB ? '(2) ' + epMaB : '');
      }

    } else if (seoRender === 'kor_content_add') {
      var kcaPassage = extractSec(raw, 'PASSAGE')        || passage || '';
      var kcaDir1    = extractSec(raw, 'DIRECTION_1')    || '';
      var kcaDir2    = extractSec(raw, 'DIRECTION_2')    || '';
      var kcaMa1     = extractSec(raw, 'MODEL_ANSWER_1') || '';
      var kcaMa2     = extractSec(raw, 'MODEL_ANSWER_2') || '';

      // 전체 지시
      q.push(dirClean2); q.push('');
      // 지문 — (A)(B) 표지 포함
      if (kcaPassage) { q.push(kcaPassage); q.push(''); }
      // (1) 질문 + ① ② 답란 (DIRECTION_1에 포함)
      if (kcaDir1) {
        q.push(cleanSeoInstruction(kcaDir1)); q.push('');
      } else {
        q.push('(1) 윗글의 내용을 본문에서 찾아 우리말로 적으시오.'); q.push('');
        q.push('①'); q.push(''); q.push('②'); q.push('');
      }
      // (2) 질문
      if (kcaDir2) {
        q.push(cleanSeoInstruction(kcaDir2)); q.push('');
      } else {
        q.push('(2) 윗글의 밑줄 친 부분의 이유를 본문에서 찾아 우리말로 적으시오.'); q.push('');
      }
      // 정답 (교사용 키)
      if (kcaMa1 || kcaMa2) {
        modelAns = (kcaMa1 ? '(1)\n' + kcaMa1 + '\n' : '') + (kcaMa2 ? '(2) ' + kcaMa2 : '');
      }

    } else if (seoRender === 'tb_blank_write_bh') {
      // 교과서 빈칸 영작_BH: 지문 + 지시문 + 보기 + 조건 + 답란 1개
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoBank2) { q.push('< 보기 >'); q.push(seoBank2); q.push(''); }
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      q.push('_____________________________________________________________________.'); q.push('');

    } else if (seoRender === 'tb_blank_content') {
      var tbDirA   = extractSec(raw, 'DIRECTION_A')  || '';
      var tbBank   = extractSec(raw, 'WORD_BANK')    || wordBankBlock || '';
      var tbCondA  = extractSec(raw, 'CONDITIONS_A') || conditionsBlock || '';
      var tbMaA    = extractSec(raw, 'MODEL_ANSWER_A') || '';
      var tbDirB   = extractSec(raw, 'DIRECTION_B')  || '';
      var tbCondB  = extractSec(raw, 'CONDITIONS_B') || '';
      var tbQa     = extractSec(raw, 'QUESTION_A')   || '';
      var tbStA    = extractSec(raw, 'STARTER_A')    || '';
      var tbQb     = extractSec(raw, 'QUESTION_B')   || '';
      var tbStB    = extractSec(raw, 'STARTER_B')    || '';
      var tbMaB    = extractSec(raw, 'MODEL_ANSWER_B') || '';

      // 전체 지시 + 지문
      q.push(dirClean2); q.push('');
      if (passage) { q.push(passage); q.push(''); }

      // (1) 빈칸 영작
      if (tbDirA) { q.push(cleanSeoInstruction(tbDirA)); q.push(''); }
      if (tbBank)  { q.push('< 보기 >'); q.push(tbBank);  q.push(''); }
      if (tbCondA) { q.push('< 조건 >'); q.push(tbCondA); q.push(''); }
      q.push('_____________________________________________________________________.'); q.push('');

      // (2) 내용 문제 2개
      if (tbDirB) { q.push(cleanSeoInstruction(tbDirB)); q.push(''); }
      if (tbCondB) { q.push('< 조건 >'); q.push(tbCondB); q.push(''); }
      if (tbQa) {
        q.push('Q. ' + tbQa);
        q.push('➀ ' + (tbStA ? tbStA + ' ' : '') + '__________________________________________');
        q.push('');
      }
      if (tbQb) {
        q.push('Q. ' + tbQb);
        q.push('➁ ' + (tbStB ? tbStB + ' ' : '') + '__________________________________________');
        q.push('');
      }

      // 정답 (교사용 키)
      if (tbMaA || tbMaB) {
        modelAns = (tbMaA ? '(1) ' + tbMaA + '\n' : '') + (tbMaB ? '(2)\n' + tbMaB : '');
      }

    } else if (seoRender === 'content_blank_grammar_bh') {
      // 내용빈칸 + 어법_BH2: TRANSFORMED_PASSAGE + Q1(표 빈칸) + Q2(어법)
      var cbgPassage = extractSec(raw, 'TRANSFORMED_PASSAGE') || passage || '';
      var cbgDirQ1   = extractSec(raw, 'Q1_DIRECTION') || '';
      var cbgTable   = extractSec(raw, 'Q1_TABLE')     || '';
      var cbgAnsQ1   = extractSec(raw, 'Q1_ANSWER')    || '';
      var cbgDirQ2   = extractSec(raw, 'Q2_DIRECTION') || '';
      var cbgAnsQ2   = extractSec(raw, 'Q2_ANSWER')    || '';

      // 지문
      if (cbgPassage) { q.push(cbgPassage); q.push(''); }

      // (1) 내용 표 빈칸
      var cbgDirQ1Clean = cleanSeoInstruction(cbgDirQ1) || '윗글의 내용을 표와 같이 정리하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 각각 1~2 단어로 쓰시오.';
      q.push('(1) ' + cbgDirQ1Clean); q.push('');
      if (cbgTable) {
        // 파이프 구분 테이블 → 텍스트 변환
        var tblLines = cbgTable.split('\n').filter(function(l){ return l.trim(); });
        tblLines.forEach(function(l){ q.push(l.trim()); });
        q.push('');
      }
      q.push('(A): ____________________');
      q.push('(B): ____________________');
      q.push('(C): ____________________'); q.push('');

      // (2) 어법 서술형
      var cbgDirQ2Clean = cleanSeoInstruction(cbgDirQ2) || '윗글의 밑줄 친 ⓐ~ⓔ 중 어법상 틀린 것을 골라 기호와 틀린 부분을 적고, 틀린 부분만을 바르게 고쳐 쓰시오.';
      q.push('(2) ' + cbgDirQ2Clean); q.push('');
      q.push('틀린 기호: ______  틀린 부분: _______________  →  바른 표현: _______________'); q.push('');

      // 정답 (교사용 키)
      if (cbgAnsQ1 || cbgAnsQ2) {
        modelAns = (cbgAnsQ1 ? '(1)\n' + cbgAnsQ1 + '\n' : '') + (cbgAnsQ2 ? '(2) ' + cbgAnsQ2 : '');
      }

    } else if (seoRender === 'topic_plus' || type.id === 'seo_topic_plus_content2') {
      var dirTopic  = extractSec(raw, 'DIRECTION_TOPIC')  || '';
      var condTopic = extractSec(raw, 'CONDITIONS_TOPIC') || '';
      var bank3     = extractSec(raw, 'WORD_BANK') || wordBankBlock || '';
      var maTop     = extractSec(raw, 'MODEL_ANSWER_TOPIC') || '';
      var dirQ1     = extractSec(raw, 'DIRECTION_Q1')  || '';
      var condQ1    = extractSec(raw, 'CONDITIONS_Q1') || '';
      var maQ1      = extractSec(raw, 'MODEL_ANSWER_Q1') || '';
      var dirQ2     = extractSec(raw, 'DIRECTION_Q2')  || '';
      var condQ2    = extractSec(raw, 'CONDITIONS_Q2') || '';
      var maQ2      = extractSec(raw, 'MODEL_ANSWER_Q2') || '';

      if (passage) { q.push(passage); q.push(''); }
      if (dirTopic) { q.push(cleanSeoInstruction(dirTopic)); q.push(''); }
      if (condTopic) { q.push('< 조건 >'); q.push(condTopic); q.push(''); }
      if (bank3) { q.push('< 보기 >'); q.push(bank3); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');
      if (dirQ1) { q.push(cleanSeoInstruction(dirQ1)); q.push(''); }
      if (condQ1) { q.push('< 조건 >'); q.push(condQ1); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');
      if (dirQ2) { q.push(cleanSeoInstruction(dirQ2)); q.push(''); }
      if (condQ2) { q.push('< 조건 >'); q.push(condQ2); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');
      if (maTop || maQ1 || maQ2) {
        modelAns = (maTop ? '① 주제: ' + maTop + '\n' : '') +
                   (maQ1  ? '② 내용1: ' + maQ1 + '\n' : '') +
                   (maQ2  ? '③ 내용2: ' + maQ2 : '');
      }

    } else {
      // 알 수 없는 seo 유형 — 기본 단일 답란 렌더
      if (passage) { q.push(passage); q.push(''); }
      q.push(dirClean2); q.push('');
      if (seoCond2) { q.push('< 조건 >'); q.push(seoCond2); q.push(''); }
      if (seoBank2) { q.push('< 보기 >'); q.push(seoBank2); q.push(''); }
      q.push('답 : _________________________________________________'); q.push('');
    }

  } else if (type.id === 'grammar_ab') {
    // 어법 선택형: 커스텀 메타프롬프트가 [정답]/[해설] 형식으로 PASSAGE: 안에 전부 넣는 경우 처리
    var gramPassage = passage;
    var gramChoices = choices.slice();

    if (gramPassage && (gramPassage.indexOf('[정답]') >= 0 || gramPassage.indexOf('[해설]') >= 0)) {
      var g_jd  = gramPassage.indexOf('[정답]');
      var g_hs  = gramPassage.indexOf('[해설]');
      var g_kt  = gramPassage.indexOf('[출제 카테고리]');

      // 선택지 추출 (➀➁➂➃➄ 또는 ①②③④⑤ 모두 지원)
      var g_ch = gramPassage.split('\n').filter(function(l){
        return l.trim().match(/^[①②③④⑤➀➁➂➃➄]/);
      });
      if (g_ch.length) gramChoices = g_ch;

      // 정답 번호 추출
      if (g_jd >= 0) {
        var g_jdLine = gramPassage.slice(g_jd).split('\n')[0];
        var g_jdM = g_jdLine.match(/[①②③④⑤➀➁➂➃➄]|\d+/);
        if (g_jdM) answer = g_jdM[0];
      }

      // 해설 추출
      if (g_hs >= 0) {
        var g_end = g_kt >= 0 ? g_kt : gramPassage.length;
        expl = gramPassage.slice(g_hs + '[해설]'.length, g_end).trim();
      }

      // 영어 지문만 남기기 (한국어 줄 또는 선택지 줄 직전까지)
      var g_lines = gramPassage.split('\n');
      var g_cut = g_lines.length;
      for (var gi = 0; gi < g_lines.length; gi++) {
        if (/[가-힣]/.test(g_lines[gi]) || g_lines[gi].trim().match(/^[①②③④⑤➀➁➂➃➄]/)) {
          g_cut = gi; break;
        }
      }
      gramPassage = g_lines.slice(0, g_cut).join('\n').trim();
    }

    q.push(direction); q.push('');
    if (gramPassage) { q.push(gramPassage); q.push(''); }
    gramChoices.forEach(function(c){ q.push(c); }); q.push('');

  } else {
    // 일반 유형
    q.push(direction); q.push('');
    if (passage) {
      // 무관한 문장: 번호①②③④⑤가 줄바꿈으로 분리된 경우 → 단락으로 합치기
      if (type.id === 'irrelevant') {
        var inlinePassage = passage
          .split('\n')
          .map(function(l){ return l.trim(); })
          .filter(function(l){ return l.length > 0; })
          .join(' ');
        q.push(inlinePassage); q.push('');
      } else {
        q.push(passage); q.push('');
      }
    }
    choices.forEach(function(c){ q.push(c); }); q.push('');
  }

  // grammar_ab 후처리: ANSWER:/EXPLANATION: 미사용 시 [정답]/[해설] 마커에서 추출
  if (type.id === 'grammar_ab') {
    if (!answer) {
      var jdM = raw.match(/\[정답\]\s*([①②③④⑤➀➁➂➃➄]|\d+)/);
      if (jdM) answer = jdM[1];
    }
    if (!expl) {
      var hsIdx = raw.indexOf('[해설]');
      if (hsIdx >= 0) {
        var ktIdx = raw.indexOf('[출제 카테고리]');
        var hsEnd = ktIdx >= 0 ? ktIdx : raw.length;
        expl = raw.slice(hsIdx + '[해설]'.length, hsEnd).trim();
      }
    }
    // 정답에 '[정답]' 접두어가 붙어있으면 제거
    if (answer) answer = answer.replace(/^\[정답\]\s*/, '').trim();
    // 해설이 '[해설]'로 시작하면 제거
    if (expl && expl.indexOf('[해설]') === 0) expl = expl.slice('[해설]'.length).trim();
  }

  q.push(DIV); q.push('');

  // ── 해설부 ──
  var a = [];
  a.push('[' + num + '번 해설] [' + type.name + ']' + (passageTitle ? ' (' + passageTitle + ')' : '')); a.push('');
  if (answer) { a.push('\u25b6 정답: ' + answer.trim()); a.push(''); }
  if (type.id.startsWith('seo')) {
    if (modelAns) { a.push('\u25b6 모범 답안:'); a.push(modelAns); a.push(''); }
    var suppressExpl = ['ext_passage', 'kor_content_add'];
    if (suppressExpl.indexOf(type.seoRender) === -1) {
      a.push(expl || '[채점 기준 없음]');
    }
  } else {
    a.push(expl || '[해설 없음]');
  }
  a.push(''); a.push(DIV); a.push('');

  return { q: q.join('\n'), a: a.join('\n') };
}

async function callAPI(type, passageText, retryHint) {
  var key   = document.getElementById('apiKeyInput').value.trim();
  var model = document.getElementById('modelSelect').value;
  if (!key) throw new Error('API 키를 입력해주세요.');
  var hint = retryHint ? '\n\n## ⚠️ 이전 출력 오류 수정 요청\n' + retryHint + '\n' : '';
  // 다중 레퍼런스 파일 합치기 (구버전 단일 reference도 지원)
  var refs = [];
  if (type.references && type.references.length) {
    type.references.forEach(function(r, i) {
      if (r.text && r.text.trim()) refs.push('### 레퍼런스 ' + (i+1) + ': ' + r.name + '\n' + r.text.trim().slice(0, 4000));
    });
  } else if (type.reference && type.reference.trim()) {
    refs.push(type.reference.trim().slice(0, 8000));
  }
  var refSection = refs.length
    ? '\n\n## 레퍼런스 자료 (참고용 — 출제 시 반영하되 그대로 복사하지 말 것)\n' + refs.join('\n\n') + '\n'
    : '';
  var globalRule = '## 출력 공통 규칙 (반드시 준수)\n- 마크다운 서식 금지: **굵게**, ## 머리글, - 목록, 표(Table)를 절대 쓰지 말고 순수 텍스트로만 출력.\n- PASSAGE:, DIRECTION:, CHOICES:, ANSWER:, SUMMARY:, MODEL_ANSWER:, EXPLANATION: 등 섹션 라벨은 줄 맨 앞에 영문 대문자 그대로 쓰고, 라벨에 별표나 머리글 기호를 붙이지 말 것.\n\n';
  var prompt = globalRule + getFixedFormat(type.id) + hint + refSection + '\n\n## 추가 출제 지침\n' + type.prompt + '\n\n[원본 지문]\n' + passageText;

  if (model.startsWith('claude')) {
    // ── Claude API ──
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        system: '지정된 형식(대문자 섹션 키: 로 시작)으로만 응답하세요. 추론 과정, 설명, 서문을 출력하지 마세요.',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!res.ok) {
      var e = await res.json().catch(function(){ return {}; });
      throw new Error(e.error && e.error.message ? e.error.message : 'HTTP ' + res.status);
    }
    var data = await res.json();
    return data.content && data.content[0] ? data.content[0].text : '';

  } else {
    // ── Gemini API ──
    // thinkingConfig는 Flash 계열만 지원 (Pro는 항상 thinking 활성화, 필드 불필요)
    var geminiBody2 = {
      contents:[{parts:[{text: prompt}]}],
      generationConfig:{maxOutputTokens:16384, temperature:0.7}
    };
    if (model.indexOf('flash') >= 0) {
      geminiBody2.generationConfig.thinkingConfig = {thinkingBudget:2048};
    }
    var res2 = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(geminiBody2)
      }
    );
    if (!res2.ok) {
      var e2 = await res2.json().catch(function(){ return {}; });
      throw new Error(e2.error && e2.error.message ? e2.error.message : 'HTTP ' + res2.status);
    }
    var data2 = await res2.json();
    // Gemini 2.5+ thinking 모드: parts[0]이 thought block(text 없음), parts[1]이 실제 답변
    var parts2 = (data2.candidates && data2.candidates[0] && data2.candidates[0].content &&
      data2.candidates[0].content.parts) ? data2.candidates[0].content.parts : [];
    var textPart2 = null;
    for (var pi = 0; pi < parts2.length; pi++) {
      if (parts2[pi].text) { textPart2 = parts2[pi]; break; }
    }
    return textPart2 ? textPart2.text : '';
  }
}

async function callWithRetry(type, text, sid) {
  var lastErr, max = 3;
  for (var n = 1; n <= max; n++) {
    try {
      if (n > 1) {
        var w = 40;
        var el = document.getElementById(sid);
        if (el) el.innerHTML = '<div class="spin"></div><span>⚠️ 재시도 (' + n + '/' + max + ') — ' + w + '초 대기중...</span>';
        await wait(w * 1000);
      }
      var result = await callAPI(type, text);

      // 어법·어휘: 번호가 지문 안에 인라인으로 5개 모두 있는지 검증
      if (type.id === 'grammar' || type.id === 'vocab') {
        // PASSAGE: 섹션만 추출해서 번호 개수 확인
        var passageMatch = result.match(/PASSAGE:\s*([\s\S]*?)(?=\nDIRECTION:|\nCHOICES:|\nANSWER:|$)/i);
        var passagePart = passageMatch ? passageMatch[1] : result.split('DIRECTION:')[0];
        var inlineCount = (passagePart.match(/[①②③④⑤]/g) || []).length;
        if (inlineCount < 5 && n < max) {
          var el2 = document.getElementById(sid);
          if (el2) el2.innerHTML = '<div class="spin"></div><span>⚠️ 번호 ' + inlineCount + '개만 감지 — 재출제 중... (' + (n+1) + '/' + max + ')</span>';
          await wait(2000);
          // 다음 루프에서 retryHint와 함께 재시도
          try {
            var hint = '이전 출력에서 ①②③④⑤ 번호가 ' + inlineCount + '개만 삽입됨. 반드시 5개 모두 지문 안에 인라인으로 삽입할 것. 번호 누락 절대 금지.';
            return await callAPI(type, text, hint);
          } catch(e2) { /* 실패 시 원본 결과 반환 */ }
        }
      }

      return result;
    } catch(e) {
      lastErr = e;
      var msg = (e.message || '').toLowerCase();
      var retry = msg.indexOf('429')>=0 || msg.indexOf('503')>=0 ||
                  msg.indexOf('quota')>=0 || msg.indexOf('overload')>=0 || msg.indexOf('high demand')>=0 ||
                  msg.indexOf('rate limit')>=0 || msg.indexOf('too many')>=0 || msg.indexOf('exhausted')>=0;
      if (!retry) throw e;
    }
  }
  throw lastErr;
}

var _curAssignment = null;
var _curRawResults = null;
var _curDateStr = '';
var _curIsRandom = false;

async function startGeneration() {
  try {
  var key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('상단에 Gemini API 키를 먼저 입력해주세요.'); return; }

  var isRandom = document.getElementById('randomToggle').checked;
  var total = isRandom ? Object.values(quotas).reduce(function(s,v){ return s+v; },0) : passages.filter(function(p){ return p.typeId !== 'unselected'; }).length;
  if (isRandom && !total) { alert('유형별 문항 수를 설정해주세요.'); return; }
  if (!passages.length) { alert('지문을 먼저 입력해주세요.'); return; }
  if (isRandom && passages.length < total) {
    alert('총 문항 수(' + total + ')보다 지문 수(' + passages.length + ')가 적습니다.'); return;
  }

  // 배정
  var assignment = [];
  if (isRandom) {
    var sh = passages.slice().sort(function(){ return Math.random()-.5; });
    var pi = 0;
    getActiveQTypes().filter(function(t){ return !t.id.startsWith('seo'); }).forEach(function(t) {
      for (var k=0; k<(quotas[t.id]||0); k++) {
        if (pi < sh.length) assignment.push({ passage: sh[pi++], typeId: t.id });
      }
    });
    assignment.sort(function(){ return Math.random()-.5; });
    // 랜덤 ON: 서술형 별도 추가
    if (document.getElementById('seoToggle').checked && seoSelected.length > 0) {
      var spool = passages.slice().sort(function(){ return Math.random()-.5; });
      for (var si=0; si<seoCount; si++) {
        assignment.push({ passage: spool[si % spool.length], typeId: seoSelected[si % seoSelected.length] });
      }
    }
  } else {
    // 랜덤 OFF: 지문 카드 배정 (객관식 + 서술형 각각)
    passages.forEach(function(p) {
      if (p.typeId && p.typeId !== 'unselected') {
        assignment.push({ passage: p, typeId: p.typeId, isSeo: false });
      }
      if (p.seoTypeId && p.seoTypeId !== 'unselected') {
        assignment.push({ passage: p, typeId: p.seoTypeId, isSeo: true });
      }
    });
  }

  if (!assignment.length) { alert('생성할 문항이 없습니다. 문항 수를 설정해주세요.'); return; }

  logUsage(assignment);
  switchTab('output');
  document.getElementById('pbWrap').style.display    = 'block';
  document.getElementById('pbWrap').classList.add('pulse-glow');
  document.getElementById('pbLabel').style.display   = 'block';
  document.getElementById('copyQBtn').style.display  = 'none';
  document.getElementById('copyABtn').style.display  = 'none';
  document.getElementById('copyAllBtn').style.display= 'none';
  document.getElementById('retryFailedBtn').style.display= 'none';
  _genCancelled = false;
  document.getElementById('generateBtn').disabled    = true;
  document.getElementById('cancelBtn').style.display = '';

  var now = new Date();
  var dateStr = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0');

  document.getElementById('outputArea').innerHTML =
    '<div class="slide-fade-in" style="margin-bottom:16px;padding:13px 18px;background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);">' +
    '<div style="font-weight:700;font-size:14px;margin-bottom:10px;font-family:\'Playfair Display\',serif;">🔄 생성 중... (' + assignment.length + '문항)</div>' +
    '<div id="statusList"></div></div>';

  var statusEl = document.getElementById('statusList');
  var rawResults = [];

  for (var i=0; i<assignment.length; i++) {
    var item = assignment[i];
    var type = null;
    if (item.isSeo) {
      var _ast = getActiveSeoTypes();
      for (var j=0; j<_ast.length; j++) { if (_ast[j].id === item.typeId) { type = _ast[j]; break; } }
    } else {
      var _aqt = getActiveQTypes();
      for (var j=0; j<_aqt.length; j++) { if (_aqt[j].id === item.typeId) { type = _aqt[j]; break; } }
    }
    if (!type) continue;

    var sid = 'st' + i;
    statusEl.insertAdjacentHTML('beforeend',
      '<div class="gi slide-fade-in" id="' + sid + '" style="animation-delay: ' + (Math.min(i, 10) * 0.1) + 's; animation-fill-mode: both;"><div class="spin"></div>' +
      '<span>' + (i+1) + '번 생성 중 — [' + type.name + '] ' + (item.passage.title||'지문') + '</span></div>');
    document.getElementById(sid).scrollIntoView({ behavior:'smooth', block:'nearest' });
    document.getElementById('pbFill').style.width = Math.round(i/assignment.length*100) + '%';
    document.getElementById('pbLabel').textContent = (i+1) + ' / ' + assignment.length;

    if (_genCancelled) break;
    if (i > 0) await wait(8000);
    if (_genCancelled) break;

    try {
      var result = await callWithRetry(type, item.passage.text, sid);
      console.log("[RAW RESPONSE " + (i+1) + "번]", result);
      rawResults.push({ num:i+1, type:type, result:result, passageTitle: item.passage.title||'' });
      var el = document.getElementById(sid);
      el.innerHTML = '<span class="di">✓</span><span>' + (i+1) + '번 [' + type.name + '] — 완료</span>';
      el.style.background  = 'var(--grs)';
      el.style.borderColor = '#a0d4b4';
    } catch(err) {
      rawResults.push({ num:i+1, type:type, result:null, error:err.message, passageTitle: item.passage.title||'' });
      var el2 = document.getElementById(sid);
      el2.innerHTML = '<span class="ei">✗</span><span>' + (i+1) + '번 [' + type.name + '] — 실패: ' + err.message + '</span>';
      el2.style.background = 'var(--acs)';
    }
  }

  document.getElementById('pbFill').style.width   = '100%';
  document.getElementById('pbWrap').classList.remove('pulse-glow');
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('pbLabel').textContent  = '완료 ' + assignment.length + '/' + assignment.length;
  document.getElementById('generateBtn').disabled = false;

  _curAssignment = assignment;
  _curRawResults = rawResults;
  _curDateStr = dateStr;
  _curIsRandom = isRandom;
  
  // saveHistory 비활성화 — 히스토리 기능 임시 중단 (로컬 캐시 용량 최적화)
  compileAndRenderOutput();

  } catch(fatalErr) {
    document.getElementById('generateBtn').disabled = false;
    alert('오류가 발생했습니다: ' + fatalErr.message);
    console.error(fatalErr);
  }
}

function compileAndRenderOutput() {
  if (!_curRawResults || !_curAssignment) return;
  var assignment = _curAssignment;
  var rawResults = _curRawResults;
  var dateStr = _curDateStr;

  var HDR = '\u2550'.repeat(60);
  var qText = 'Seum Teachers Lab [문제]\n' + dateStr + ' · 총 ' + assignment.length + '문항\n' + HDR + '\n\n';
  var aText = 'Seum Teachers Lab [해설]\n' + dateStr + '\n' + HDR + '\n\n';
  var ansList = [];
  var hasFailures = false;

  rawResults.forEach(function(r) {
    if (r.result) {
      var sec = toSections(r.num, r.type, r.result, r.passageTitle);
      qText += sec.q; aText += sec.a;
      var ans = extractSec(r.result, 'ANSWER');
      if (!ans && r.type && r.type.id && r.type.id.startsWith('seo')) {
        ans = extractSec(r.result, 'MODEL_ANSWER');
      }
      if (ans) ansList.push(r.num + '번: ' + ans.trim());
    } else {
      qText += '[' + r.num + '번 생성 실패]\n\n';
      aText += '[' + r.num + '번 해설 없음]\n\n';
      hasFailures = true;
    }
  });

  if (ansList.length) {
    qText += '\n[정답표]\n' + ansList.join('   ') + '\n';
    aText += '\n[정답표]\n' + ansList.join('   ') + '\n';
  }
  window._allText = qText + '\n\n' + HDR + '\n\n' + aText;

  var taStyle = 'width:100%;padding:14px;font-family:\'Noto Sans KR\',sans-serif;font-size:13px;line-height:1.9;border:1px solid var(--bd);border-radius:var(--r);background:var(--sf);color:var(--ink);resize:vertical;outline:none;height:calc(100vh - 260px);';

  var existing = document.getElementById('renderedOutputGrid');
  if (existing) existing.parentNode.removeChild(existing);

  document.getElementById('outputArea').insertAdjacentHTML('beforeend',
    '<div id="renderedOutputGrid" class="slide-fade-in" style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px;animation-delay: 0.2s; animation-fill-mode: both;">' +
    '<div>' +
    '<div style="font-family:\'Playfair Display\',serif;font-size:15px;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:2px solid var(--ac);">📝 문제 영역</div>' +
    '<div style="font-size:11px;color:var(--ink3);margin-bottom:8px">복사 후 한글/워드에 붙여넣으세요</div>' +
    '<textarea id="taQ" readonly style="' + taStyle + '"></textarea></div>' +
    '<div>' +
    '<div style="font-family:\'Playfair Display\',serif;font-size:15px;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:2px solid var(--gr);">💡 해설 영역</div>' +
    '<div style="font-size:11px;color:var(--ink3);margin-bottom:8px">정답 근거 및 오답 분석 포함</div>' +
    '<textarea id="taA" readonly style="' + taStyle + '"></textarea></div>' +
    '</div>');

  document.getElementById('taQ').value = qText;
  document.getElementById('taA').value = aText;
  document.getElementById('copyQBtn').style.display   = '';
  document.getElementById('copyABtn').style.display   = '';
  document.getElementById('copyAllBtn').style.display = '';
  document.getElementById('retryFailedBtn').style.display = hasFailures ? '' : 'none';

  document.getElementById('taQ').scrollIntoView({ behavior:'smooth' });
}

async function retryFailedItems() {
  if (!_curRawResults || !_curAssignment) return;
  var failedIndices = [];
  _curRawResults.forEach(function(r, idx) {
    if (!r.result) failedIndices.push(idx);
  });
  if (failedIndices.length === 0) return;
  
  var key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { alert('상단에 Gemini API 키를 먼저 입력해주세요.'); return; }
  
  document.getElementById('retryFailedBtn').style.display = 'none';
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('cancelBtn').style.display = '';
  _genCancelled = false;
  
  for (var i = 0; i < failedIndices.length; i++) {
    var rawIdx = failedIndices[i];
    var item = _curAssignment[rawIdx];
    var type = _curRawResults[rawIdx].type;
    var sid = 'st' + rawIdx;
    
    var el = document.getElementById(sid);
    if (el) {
      el.innerHTML = '<div class="spin"></div><span>' + (rawIdx+1) + '번 재시도 중 — [' + type.name + '] ' + (item.passage.title||'지문') + '</span>';
      el.style.background = 'var(--sf)';
      el.style.borderColor = 'var(--bd)';
      el.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
    
    if (_genCancelled) break;
    if (i > 0) await wait(8000);
    if (_genCancelled) break;
    
    try {
      var result = await callWithRetry(type, item.passage.text, sid);
      _curRawResults[rawIdx].result = result;
      _curRawResults[rawIdx].error = null;
      if (el) {
        el.innerHTML = '<span class="di">✓</span><span>' + (rawIdx+1) + '번 [' + type.name + '] — 완료 (재시도 성공)</span>';
        el.style.background  = 'var(--grs)';
        el.style.borderColor = '#a0d4b4';
      }
    } catch(err) {
      _curRawResults[rawIdx].error = err.message;
      if (el) {
        el.innerHTML = '<span class="ei">✗</span><span>' + (rawIdx+1) + '번 [' + type.name + '] — 실패: ' + err.message + '</span>';
        el.style.background = 'var(--acs)';
      }
    }
  }
  
  document.getElementById('generateBtn').disabled = false;
  document.getElementById('cancelBtn').style.display = 'none';
  
  compileAndRenderOutput();
  
  // 히스토리 저장 비활성화 — 기능 임시 중단
}

// ─── HISTORY ───
var examHistory = [];

// [히스토리 기능 임시 중단] 기존 examHistory 데이터를 완전 삭제하여 캐시 용량 즉시 확보
(function purgeHistoryData() {
  try {
    _originalRemoveItem.call(localStorage, 'examHistory');
    // 매니저 계정의 격리 히스토리도 정리
    ['manager1', 'manager2', 'manager3'].forEach(function(uid) {
      _originalRemoveItem.call(localStorage, uid + '_examHistory');
    });
    console.log('✅ examHistory 데이터 삭제 완료 — 캐시 용량 확보');
  } catch(e) {}
})();

function persistHistory() {
  // 최대 20세트만 보관 (localStorage 과부하 방지)
  if (examHistory.length > 20) examHistory = examHistory.slice(-20);
  localStorage.setItem('examHistory', JSON.stringify(examHistory));
  fbSyncDebounced();
}

function saveHistory(dateStr, assignment, rawResults, isRandom) {
  var record = {
    date: dateStr,
    isRandom: !!isRandom,
    setName: (function(){
      // 현재 passages와 일치하는 세트명 찾기
      var keys = Object.keys(passageSets);
      for (var i=0; i<keys.length; i++) {
        var s = passageSets[keys[i]];
        if (s.length === passages.length) {
          var match = s.every(function(p,idx){ return passages[idx] && passages[idx].text === p.text; });
          if (match) return keys[i];
        }
      }
      return null;
    })(),
    total: assignment.length,
    items: assignment.map(function(a, i) {
      var r = rawResults[i] || {};
      var ans = r.result ? extractSec(r.result, 'ANSWER') : '';
      return {
        passageTitle: a.passage.title || ('지문 ' + (i+1)),
        typeId: a.typeId,
        typeName: (function(){ var t = qTypes.find(function(q){ return q.id===a.typeId; }); return t ? t.name : a.typeId; })(),
        answer: ans ? ans.trim() : '',
        success: !!r.result
      };
    })
  };
  examHistory.push(record);
  persistHistory();
  // renderHistory는 히스토리 탭 진입 시에만 실행 (switchTab에서 호출)
}

var _histFilter = null;  // 현재 선택된 세트 필터

function renderHistSetBar() {
  var sel = document.getElementById('histSetSelect');
  if (!sel) return;
  // 저장된 세트 (passageSets) + 히스토리에 등장한 세트 병합
  var sets = [];
  Object.keys(passageSets).forEach(function(k){ if (sets.indexOf(k) < 0) sets.push(k); });
  examHistory.forEach(function(r){ if (r.setName && sets.indexOf(r.setName) < 0) sets.push(r.setName); });
  if (examHistory.some(function(r){ return !r.setName; }) && sets.indexOf('수동 배정') < 0) sets.push('수동 배정');
  var cur = sel.value;
  sel.innerHTML = '<option value="">전체</option>' + sets.map(function(s) {
    return '<option value="' + s + '"' + (cur === s ? ' selected' : '') + '>' + s + '</option>';
  }).join('');
  sel.value = _histFilter || '';
}

function setHistFilter(name) {
  _histFilter = (!name || name === '전체') ? null : name;
  renderHistory();
  loadReportsFromSheets();
  initReportQtype();
}

function renderHistory() {
  renderHistSetBar();
  var el = document.getElementById('historyArea');
  if (!el) return; // 히스토리 기능 임시 중단 — historyArea 요소 없음
  if (!examHistory.length) {
    el.innerHTML = '<div class="empty"><div class="eic">📋</div><div class="eti">출제 기록이 없습니다</div><div>시험지를 생성하면 여기에 기록됩니다</div></div>';
    return;
  }

  // 필터 적용
  var filtered = examHistory.filter(function(r) {
    if (_histFilter === null) return true;
    if (_histFilter === '수동 배정') return !r.setName;
    return r.setName === _histFilter;
  });

  if (!filtered.length) {
    el.innerHTML = '<div class="empty"><div class="eic">📋</div><div class="eti">해당 세트의 출제 기록이 없습니다</div></div>';
    return;
  }

  // 회차 인덱스 (전체 기준)
  function globalIdx(rec) { return examHistory.indexOf(rec); }

  // 행 순서: 현재 입력된 지문 순서 → 세트 순서 → 히스토리 순서
  var allTitles = [];
  // 1순위: 현재 passages 순서
  passages.forEach(function(p) {
    var t = p.title || '제목 없음';
    if (allTitles.indexOf(t) < 0) allTitles.push(t);
  });
  // 2순위: 선택된 세트 지문 순서 (현재 지문에 없는 것만 추가)
  if (_histFilter && passageSets[_histFilter]) {
    passageSets[_histFilter].forEach(function(p) {
      var t = p.title || '제목 없음';
      if (allTitles.indexOf(t) < 0) allTitles.push(t);
    });
  }
  // 3순위: 히스토리에만 있는 지문 (위에 없는 것만 추가)
  filtered.forEach(function(rec) {
    rec.items.forEach(function(item) {
      if (allTitles.indexOf(item.passageTitle) < 0) allTitles.push(item.passageTitle);
    });
  });

  // 표 헤더 (회차)
  var thead = '<tr><th>지문</th>' + filtered.map(function(rec, ri) {
    var roundNum = globalIdx(rec) + 1;
    var modeLabel = rec.isRandom
      ? '<span style="color:#2980b9;font-size:9px;font-weight:700;">랜덤</span>'
      : '<span style="color:#1a6b3a;font-size:9px;font-weight:700;">유형지정</span>';
    return '<th>' + roundNum + '회 ' + modeLabel + '<br><span style="font-weight:400;color:var(--ink3);font-size:10px;">' + rec.date + '</span><br><button onclick="deleteHistory(' + globalIdx(rec) + ')" style="margin-top:4px;font-size:10px;padding:2px 7px;border-radius:6px;border:1px solid #f0c0bb;background:#fff5f5;color:var(--ac);cursor:pointer;font-family:\'Noto Sans KR\',sans-serif;" title="이 회차 삭제">✕ 삭제</button></th>';
  }).join('') + '</tr>';

  // 표 본문 (지문별 행)
  var tbody = allTitles.map(function(title) {
    var cells = filtered.map(function(rec) {
      // 해당 지문이 이 회차에서 출제된 항목들 (같은 지문이 여러 유형으로 출제될 수 있음)
      var matches = rec.items.filter(function(item){ return item.passageTitle === title; });
      if (!matches.length) return '<td><span class="hcell-empty">—</span></td>';
      var tags = matches.map(function(m) {
        var ti = qTypes.findIndex(function(t){ return t.id===m.typeId; });
        var hex = ti >= 0 ? HEXES[ti % HEXES.length] : '#888';
        var ans = m.answer ? ' (' + m.answer + ')' : '';
        var fail = m.success ? '' : ' ✗';
        return '<span class="hcell" style="background:' + hex + ';margin:1px;">' + m.typeName + ans + fail + '</span>';
      }).join('<br>');
      return '<td>' + tags + '</td>';
    }).join('');
    return '<tr><td>' + title + '</td>' + cells + '</tr>';
  }).join('');

  el.innerHTML = '<div class="htable-wrap"><table class="htable"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>';
}

function deleteHistory(idx) {
  examHistory.splice(idx, 1);
  persistHistory();
  renderHistory();
  loadReportsFromSheets();
  initReportQtype();
}

function clearHistory() {
  if (!examHistory.length) return;
  if (!confirm('모든 출제 기록을 삭제하시겠습니까?')) return;
  examHistory = [];
  persistHistory();
  renderHistory();
  loadReportsFromSheets();
  initReportQtype();
}

function copySection(sec) {
  var text = sec === 'q' ? (document.getElementById('taQ')||{}).value
           : sec === 'a' ? (document.getElementById('taA')||{}).value
           : window._allText || '';
  if (!text) { alert('생성된 문항이 없습니다.'); return; }
  var label = sec==='q' ? '문제 영역' : sec==='a' ? '해설 영역' : '전체';
  navigator.clipboard.writeText(text)
    .then(function(){ alert('[' + label + '] 복사 완료!\n한글/워드에 붙여넣으세요.'); })
    .catch(function(){
      var ta = sec==='q' ? document.getElementById('taQ') : document.getElementById('taA');
      if (ta) { ta.focus(); ta.select(); document.execCommand('copy'); }
      alert('복사되었습니다.');
    });
}

// ─── MODEL SELECTION ───
function saveModel() {
  var m = document.getElementById('modelSelect').value;
  localStorage.setItem('selectedModel', m);
}

// ─── GUIDE ───
function openGuide() { document.getElementById('guideModal').classList.add('open'); }
function closeGuide() { document.getElementById('guideModal').classList.remove('open'); }

// 처음 접속 시 가이드 자동 표시
if (!localStorage.getItem('guideShown')) {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function(){
      if (sessionStorage.getItem('seumAuth') === '1') {
        document.getElementById('guideModal').classList.add('open');
        localStorage.setItem('guideShown', '1');
      }
    }, 500);
  });
}

// ─── ACCESS CODE ───

function reloadMemoryForUser() {
  qTypes = mergeWithDefaultQTypes(JSON.parse(localStorage.getItem('qTypes_v5') || 'null'));
  passages    = JSON.parse(localStorage.getItem('passages')    || '[]');
  quotas      = JSON.parse(localStorage.getItem('quotas')      || 'null') || {};
  seoCount    = parseInt(localStorage.getItem('seoCount')      || '1');
  seoSelected = JSON.parse(localStorage.getItem('seoSelected') || '[]');
  healSeoSelected();
  promptSets  = JSON.parse(localStorage.getItem('promptSets_v1') || '{}');

  autoHealStorage(); // 덩치 큰 레퍼런스 무조건 복구/압축 진행 (이미 위에 선언됨)

  // Re-initialize editingQTypes based on current settingsCat
  if (SCHOOL_NAMES.indexOf(settingsCat) >= 0) {
    editingQTypes = mergeWithDefaultQTypes(JSON.parse(JSON.stringify(schoolPresets[settingsCat] || DEFAULT_TYPES)));
  } else if (settingsCat === '기본설정') {
    editingQTypes = JSON.parse(JSON.stringify(DEFAULT_TYPES));
  } else {
    editingQTypes = JSON.parse(JSON.stringify(qTypes));
  }

  renderSettingsCategoryTabs();
  renderSettingsEditorVisibility();
  renderTypeList();
  selectType(0);
  renderPassageList();
  renderQuotaRows();
  renderSeoTypeRows();
  var sCont = document.getElementById('seoCount'); if (sCont) sCont.textContent = seoCount;
  renderSetBar();
  renderPromptSetBar();
  renderActiveCategoryDisplay();
  var sel = document.getElementById('activeCategorySelect');
  if (sel) sel.value = activeCategory;
  // renderHistory()는 제거 — 히스토리 탭 클릭 시에만 지연 로딩
}

function checkCode() {
  var input = document.getElementById('codeInput').value.trim();
  var err   = document.getElementById('codeErr');
  if (CODES.indexOf(input) >= 0) {
    sessionStorage.setItem('seumAuth', '1');
    sessionStorage.setItem('seumUserId', input);
    
    try {
      reloadMemoryForUser();
    } catch(e) {
      alert("로그인 중 일시적인 화면 로드 지연이 발생했습니다: " + e.message + "\n잠시 후 다시 시도해주세요.");
      console.error(e);
    }
    
    // UI Update with Animation
    var lockScreen = document.getElementById('lockScreen');
    lockScreen.classList.add('fade-up-out');
    
    // Add stagger classes to main elements
    var header = document.querySelector('header');
    if(header) header.classList.add('stagger-in');
    var tabs = document.querySelector('.tabs');
    if(tabs) tabs.classList.add('stagger-in', 'stagger-delay-1');
    document.querySelectorAll('.panel.active').forEach(function(p) { p.classList.add('stagger-in', 'stagger-delay-2'); });

    setTimeout(function() {
      lockScreen.style.display = 'none';
    }, 500);
    
    if (CLOUD_CODES.indexOf(input) >= 0) {
      if (fbDb) {
        fbPullData(true);
      } else {
        // Firebase 재초기화 시도
        console.warn('fbDb is null for cloud code, retrying Firebase init...');
        initFirebase();
        if (fbDb) {
          fbPullData(true);
        } else {
          setSyncStatus('syncerr', '☁ 연결 실패 — 새로고침 필요');
          console.error('Firebase DB를 초기화할 수 없습니다. 네트워크 연결을 확인하세요.');
        }
      }
    } else {
      setSyncStatus('syncno', '💾 로컬 저장');
      if (fbDb) fbPullSharedSchoolPresets();
    }
    showMigrationIfCloud();
    showMasterAdminSection();
    renderSettingsCategoryTabs();
    renderSettingsEditorVisibility();
  } else {
    err.textContent = '코드가 올바르지 않습니다.';
    document.getElementById('codeInput').value = '';
    document.getElementById('codeInput').focus();
    setTimeout(function(){ err.textContent = ''; }, 2000);
  }
}

// 이미 인증된 세션이면 잠금 화면 건너뜀
if (sessionStorage.getItem('seumAuth') === '1') {
  document.getElementById('lockScreen').style.display = 'none';
  showMigrationIfCloud();
  showMasterAdminSection();
  renderSettingsCategoryTabs();
  renderSettingsEditorVisibility();
  // Add stagger classes to main elements for initial load
  var header = document.querySelector('header');
  if(header) header.classList.add('stagger-in');
  var tabs = document.querySelector('.tabs');
  if(tabs) tabs.classList.add('stagger-in', 'stagger-delay-1');
  document.querySelectorAll('.panel.active').forEach(function(p) { p.classList.add('stagger-in', 'stagger-delay-2'); });
}

// ─── REQUIRED PROMPT BOX ───
function toggleRequired() {
  var body = document.getElementById('reqBody');
  var icon = document.getElementById('reqToggleIcon');
  var open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  icon.textContent   = open ? '▼' : '▲';
}

// ─── ERROR REPORT ───
// ※ Google Apps Script 배포 URL을 아래에 붙여넣으세요
var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw_NytzSMeQ9g6LYdhA3qKhjUBnK8CKnVvbm-lPP2v4oHjZR2BgQBAkXMPq5etzPlpL/exec';

var reports = [];
localStorage.removeItem('errorReports');

function persistReports() {
  // 로컬 저장 비활성화 — 오류 보고는 Google Sheets로만 전송
}

function initReportQtype() {
  var sel = document.getElementById('reportQtype');
  if (!sel) return;
  sel.innerHTML = '<option value="">선택하세요</option>' +
    qTypes.map(function(t){ return '<option value="' + t.name + '">' + t.name + '</option>'; }).join('');
}

function submitReport() {
  var type    = document.getElementById('reportType').value;
  var qtype   = document.getElementById('reportQtype').value;
  var content = document.getElementById('reportContent').value.trim();
  if (!type)    { alert('오류 유형을 선택해주세요.'); return; }
  if (!content) { alert('오류 내용을 입력해주세요.'); return; }
  var now = new Date();
  var dateStr = now.getFullYear() + '.' +
    String(now.getMonth()+1).padStart(2,'0') + '.' +
    String(now.getDate()).padStart(2,'0') + ' ' +
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0');
  var rec = { type:type, qtype:qtype, content:content, date:dateStr, status:'new' };

  // Google Sheets 전송
  if (SHEETS_URL) {
    var btn = document.querySelector('.gbtn[onclick="submitReport()"]');
    if (btn) { btn.textContent = '전송 중...'; btn.disabled = true; }
    fetch(SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify(rec)
    }).then(function(r){ return r.json(); })
    .then(function(){
      loadReportsFromSheets();
      document.getElementById('reportType').value    = '';
      document.getElementById('reportQtype').value   = '';
      document.getElementById('reportContent').value = '';
      if (btn) { btn.textContent = '📤 보고하기'; btn.disabled = false; }
      alert('오류가 Google Sheets에 보고되었습니다. 감사합니다!');
    }).catch(function(){
      document.getElementById('reportType').value    = '';
      document.getElementById('reportQtype').value   = '';
      document.getElementById('reportContent').value = '';
      if (btn) { btn.textContent = '📤 보고하기'; btn.disabled = false; }
      alert('전송에 실패했습니다. 네트워크 연결을 확인해주세요.');
    });
  } else {
    alert('SHEETS_URL이 설정되지 않았습니다. 관리자에게 문의해주세요.');
  }
}

function loadReportsFromSheets() {
  if (!SHEETS_URL) { renderReports(); return; }
  fetch(SHEETS_URL)
    .then(function(r){ return r.json(); })
    .then(function(data) {
      // 서버 데이터를 최신순으로 표시
      data.reverse();
      data.forEach(function(r){ if (!r.status) r.status = 'new'; });
      // 로컬 보고와 합치지 않고 서버 데이터로 대체
      document.getElementById('reportList').innerHTML = data.length ? data.map(function(r, i) {
        var tc  = TAG_CLASS[r.type] || 'rtag-etc';
        return '<div class="rcard">' +
          '<div class="rcard-head">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              '<span class="rtag ' + tc + '">' + r.type + '</span>' +
              (r.qtype ? '<span style="font-size:11px;color:var(--ink3);">[' + r.qtype + ']</span>' : '') +
            '</div>' +
            '<span class="rcard-meta">' + r.date + '</span>' +
          '</div>' +
          '<div class="rcard-body">' + (r.content||'').replace(/\n/g,'<br>') + '</div>' +
        '</div>';
      }).join('') : '<div class="empty"><div class="eic">✅</div><div class="eti">보고된 오류가 없습니다</div></div>';
    })
    .catch(function(){ renderReports(); });
}

function toggleReportStatus(idx) {
  reports[idx].status = reports[idx].status === 'new' ? 'checked' : 'new';
  persistReports(); renderReports();
}

function deleteReport(idx) {
  reports.splice(idx, 1);
  persistReports(); renderReports();
}

function clearReports() {
  if (!reports.length) return;
  if (!confirm('모든 오류 보고를 삭제하시겠습니까?')) return;
  reports = []; persistReports(); renderReports();
}

var TAG_CLASS = {
  '문제 파싱 오류':'rtag-parse','API 오류':'rtag-api','문항 품질':'rtag-quality',
  'UI 오류':'rtag-ui','히스토리 오류':'rtag-history','기타':'rtag-etc'
};

function renderReports() {
  var el = document.getElementById('reportList');
  if (!el) return;
  if (!reports.length) {
    el.innerHTML = '<div class="empty"><div class="eic">✅</div><div class="eti">보고된 오류가 없습니다</div></div>';
    return;
  }
  el.innerHTML = reports.map(function(r, i) {
    var tc  = TAG_CLASS[r.type] || 'rtag-etc';
    var isc = r.status === 'checked';
    return '<div class="rcard">' +
      '<div class="rcard-head">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="rtag ' + tc + '">' + r.type + '</span>' +
          (r.qtype ? '<span style="font-size:11px;color:var(--ink3);">[' + r.qtype + ']</span>' : '') +
          '<span class="rstatus ' + (isc?'rstatus-checked':'rstatus-new') + '" onclick="toggleReportStatus(' + i + ')" title="클릭하여 상태 변경">' +
            (isc ? '✓ 확인됨' : '● 신규') + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="rcard-meta">' + r.date + '</span>' +
          '<button class="mb d" onclick="deleteReport(' + i + ')">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="rcard-body">' + r.content.replace(/\n/g,'<br>') + '</div>' +
    '</div>';
  }).join('');
}

// ─── FIREBASE SYNC ───
// ※ Firebase Console(https://console.firebase.google.com)에서 프로젝트를 생성한 후
//   [프로젝트 설정 > 내 앱 > SDK 설정 및 구성]의 firebaseConfig 값을 아래에 붙여넣으세요.
//   이 설정은 관리자가 1회만 하면 됩니다. 사용자는 아무 설정도 불필요합니다.
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCQJPBfbgpBAgokaFEAn85f0bA0r1CI0Ow",
  authDomain:        "seum-teachers-lab.firebaseapp.com",
  projectId:         "seum-teachers-lab",
  storageBucket:     "seum-teachers-lab.firebasestorage.app",
  messagingSenderId: "1067756076746",
  appId:             "1:1067756076746:web:27168fb8c902ccf2ad3e33"
};

var fbApp = null, fbDb = null;
var _fbSyncTimer = null;

function fbUserId() {
  // CLOUD_CODES에 해당하는 코드로 로그인한 경우만 Firebase ID 반환
  // 그 외(seum2025 등)는 빈 문자열 → Firebase 사용 안 함 → 로컬 저장만
  var uid = sessionStorage.getItem('seumUserId') || '';
  return CLOUD_CODES.indexOf(uid) >= 0 ? uid : '';
}

function setSyncStatus(state, text) {
  var el = document.getElementById('syncStatus');
  if (!el) return;
  el.className = 'syncst ' + state;
  el.textContent = text;
}

function initFirebase() {
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) return; // 미설정 시 스킵
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK가 아직 로드되지 않았습니다. 3초 후 재시도합니다.');
    setSyncStatus('syncing', '☁ SDK 로딩 중...');
    setTimeout(function() {
      if (typeof firebase !== 'undefined') {
        initFirebase();
        // 재초기화 성공 시, 클라우드 코드 세션이면 자동 Pull
        if (fbDb && fbUserId()) {
          fbPullData(true);
        }
      } else {
        setSyncStatus('syncerr', '☁ SDK 로드 실패');
        console.error('Firebase SDK 로드에 실패했습니다. 페이지를 새로고침해주세요.');
      }
    }, 3000);
    return;
  }
  try {
    fbApp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(FIREBASE_CONFIG);
    fbDb  = firebase.firestore(fbApp);
    setSyncStatus('syncok', '☁ 연결됨');
  } catch(e) {
    console.error('Firebase init error', e);
    setSyncStatus('syncerr', '☁ 연결 오류');
  }
}

function fbGetData() {
  return { qTypes, passages, passageSets, promptSets, quotas, seoCount, seoSelected };
}

function fbApplyData(data) {
  if (!data) return;
  if (Array.isArray(data.qTypes))                         { qTypes = mergeWithDefaultQTypes(data.qTypes); localStorage.setItem('qTypes_v5', JSON.stringify(qTypes)); }
  if (Array.isArray(data.passages))                       { passages = data.passages;         localStorage.setItem('passages',    JSON.stringify(passages)); }
  if (data.passageSets && typeof data.passageSets==='object') { passageSets = data.passageSets; localStorage.setItem('passageSets', JSON.stringify(passageSets)); }
  if (data.promptSets  && typeof data.promptSets==='object')  { promptSets = data.promptSets;   localStorage.setItem('promptSets_v1', JSON.stringify(promptSets)); }
  if (data.quotas      && typeof data.quotas==='object')  { quotas = data.quotas;             localStorage.setItem('quotas',      JSON.stringify(quotas)); }
  if (typeof data.seoCount === 'number')                  { seoCount = data.seoCount;         localStorage.setItem('seoCount',    seoCount); }
  if (Array.isArray(data.seoSelected))                    { seoSelected = data.seoSelected;   localStorage.setItem('seoSelected', JSON.stringify(seoSelected)); }
  // examHistory 비활성화 — 히스토리 기능 임시 중단
  renderTypeList(); selectType(0); renderPassageList(); renderQuotaRows();
  renderSeoTypeRows(); document.getElementById('seoCount').textContent = seoCount;
  renderSetBar(); renderPromptSetBar();
  // 학교별 공유 프롬프트 동기화 (shared/schoolPresets)
  fbPullSharedSchoolPresets();
  // 서술형 공유 프롬프트 동기화 (shared/seoTypes)
  fbPullSharedSeoTypes();
}

// 로그인 시 해당 코드의 클라우드 데이터를 조용히 불러옴
function fbPullData(silent) {
  if (!fbDb) return;
  var uid = fbUserId();
  if (!uid) return;
  setSyncStatus('syncing', '☁ 불러오는 중...');
  fbDb.collection('users').doc(uid).get()
    .then(function(doc) {
      if (doc.exists) { fbApplyData(doc.data()); }
      setSyncStatus('syncok', '☁ ' + uid);
    })
    .catch(function(e) { setSyncStatus('syncerr', '☁ 오류'); console.error(e); });
}

// ─── 사용량 로그 ───
function logUsage(assignment) {
  if (!fbDb || !fbUserId()) return;
  var typeCounts = {};
  assignment.forEach(function(item) {
    typeCounts[item.typeId] = (typeCounts[item.typeId] || 0) + 1;
  });
  fbDb.collection('usage_logs').add({
    uid: fbUserId(),
    ts: new Date().toISOString(),
    total: assignment.length,
    types: typeCounts,
    isRandom: !!(document.getElementById('randomToggle') && document.getElementById('randomToggle').checked)
  }).catch(function(e){ console.warn('usage log failed', e); });
}

function loadUsageStats() {
  if (!isMaster() || !fbDb) return;
  var el = document.getElementById('usageStatsContent');
  if (el) el.textContent = '로딩 중...';
  fbDb.collection('usage_logs').orderBy('ts', 'desc').limit(500).get()
    .then(function(snap) {
      var logs = [];
      snap.forEach(function(d) { logs.push(d.data()); });
      renderUsageStats(logs);
    })
    .catch(function(e) {
      if (el) el.textContent = '오류: ' + e.message;
    });
}

function renderUsageStats(logs) {
  var el = document.getElementById('usageStatsContent');
  if (!el) return;

  // 모든 유형 이름 맵 (객관식 + 서술형)
  var typeNameMap = {};
  DEFAULT_TYPES.forEach(function(t){ typeNameMap[t.id] = t.name; });
  getActiveSeoTypes().forEach(function(t){ typeNameMap[t.id] = t.name; });

  // uid별 집계
  var byUid = {};
  logs.forEach(function(log) {
    if (!log.uid) return;
    if (!byUid[log.uid]) byUid[log.uid] = { sessions:0, total:0, types:{}, lastTs:'' };
    var u = byUid[log.uid];
    u.sessions++;
    u.total += (log.total || 0);
    if (log.ts > u.lastTs) u.lastTs = log.ts;
    Object.keys(log.types || {}).forEach(function(tid) {
      u.types[tid] = (u.types[tid] || 0) + log.types[tid];
    });
  });

  if (!Object.keys(byUid).length) {
    el.innerHTML = '<div style="color:var(--ink3);padding:16px 0;">아직 생성 기록이 없습니다.</div>';
    return;
  }

  // 최신 활동 순 정렬
  var uids = Object.keys(byUid).sort(function(a,b){ return byUid[b].lastTs.localeCompare(byUid[a].lastTs); });

  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:8px;">';
  uids.forEach(function(uid) {
    var u = byUid[uid];
    // 상위 3 유형
    var topTypes = Object.keys(u.types).sort(function(a,b){ return u.types[b]-u.types[a]; }).slice(0,3);
    var topHtml = topTypes.map(function(tid) {
      return '<span style="display:inline-flex;align-items:center;gap:4px;background:var(--bls);border:1px solid #a0b8e0;border-radius:99px;padding:2px 9px;font-size:11px;color:var(--bl);font-weight:600;">' +
        (typeNameMap[tid] || tid) + ' <span style="color:var(--ink3);font-weight:400;">×' + u.types[tid] + '</span></span>';
    }).join(' ');
    var lastDate = u.lastTs ? u.lastTs.slice(0,10) : '-';
    html += '<div style="background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:14px 16px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
        '<span style="font-weight:700;font-size:14px;color:var(--ink);">👤 ' + uid + '</span>' +
        '<span style="font-size:11px;color:var(--ink3);">마지막: ' + lastDate + '</span>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--ink3);margin-bottom:8px;">생성 세션 <strong style="color:var(--ink);">' + u.sessions + '회</strong> · 총 <strong style="color:var(--ink);">' + u.total + '문항</strong></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + (topHtml || '<span style="font-size:11px;color:var(--ink3);">유형 정보 없음</span>') + '</div>' +
    '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// 데이터 변경 후 즉시 저장
function fbSyncImmediate() {
  if (!fbDb || !fbUserId()) return;
  clearTimeout(_fbSyncTimer);
  setSyncStatus('syncing', '☁ 저장 중...');
  fbDb.collection('users').doc(fbUserId()).set(fbGetData())
    .then(function()  { setSyncStatus('syncok', '☁ ' + fbUserId()); })
    .catch(function(e){ setSyncStatus('syncerr', '☁ 오류'); console.error(e); });
}

// 데이터 변경 후 2초 뒤 자동 저장 (debounce)
function fbSyncDebounced() {
  if (!fbDb || !fbUserId()) return;
  clearTimeout(_fbSyncTimer);
  setSyncStatus('syncing', '☁ 대기 중...');
  _fbSyncTimer = setTimeout(function() {
    fbSyncImmediate();
  }, 2000);
}

// ─── REFERENCE FILES (다중) ───
var _curRefs = [];  // [{ name, text }, ...] 현재 편집 중인 유형의 레퍼런스 목록

function renderRefList() {
  var listEl   = document.getElementById('refList');
  var countEl  = document.getElementById('refFileCount');
  var clearAll = document.getElementById('refClearAllBtn');
  if (!listEl) return;
  if (!_curRefs.length) {
    listEl.innerHTML = '';
    countEl.textContent = '';
    clearAll.style.display = 'none';
    return;
  }
  countEl.textContent = _curRefs.length + '개 파일';
  clearAll.style.display = '';
  listEl.innerHTML = _curRefs.map(function(r, i) {
    var sizeKb = (r.text.length / 1024).toFixed(1);
    var prevId = 'refprev_' + i;
    return '<div class="refitem">' +
      '<div class="refitem-head">' +
        '<span style="font-size:13px;">📄</span>' +
        '<span class="refitem-name">' + r.name + '</span>' +
        '<span class="refitem-size">' + sizeKb + ' KB</span>' +
        '<button class="refbtn" style="padding:2px 8px;font-size:11px;" onclick="toggleRefPreview(' + i + ',' + JSON.stringify(prevId) + ')">미리보기</button>' +
        '<button class="refbtn" style="padding:2px 8px;font-size:11px;color:var(--ac);border-color:#f0c0bb;" onclick="removeRefFile(' + i + ')">✕</button>' +
      '</div>' +
      '<pre class="refitem-prev" id="' + prevId + '">' + escHtml(r.text.slice(0, 400)) + (r.text.length > 400 ? '\n...(일부 미리보기)' : '') + '</pre>' +
    '</div>';
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toggleRefPreview(i, prevId) {
  var el = document.getElementById(prevId);
  if (!el) return;
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function onRefFileChange(input) {
  var files = Array.from(input.files);
  if (!files.length) return;
  var oversize = files.filter(function(f){ return f.size > 200000; });
  if (oversize.length) {
    alert('200KB를 초과하는 파일은 추가할 수 없습니다:\n' + oversize.map(function(f){ return f.name; }).join('\n'));
  }
  var valid = files.filter(function(f){ return f.size <= 200000; });
  if (!valid.length) { input.value = ''; return; }

  var loaded = 0;
  valid.forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      // 중복 파일명은 덮어쓰기
      var exists = _curRefs.findIndex(function(r){ return r.name === file.name; });
      if (exists >= 0) {
        _curRefs[exists] = { name: file.name, text: e.target.result };
      } else {
        _curRefs.push({ name: file.name, text: e.target.result });
      }
      loaded++;
      if (loaded === valid.length) renderRefList();
    };
    reader.readAsText(file, 'UTF-8');
  });
  input.value = '';
}

function removeRefFile(i) {
  _curRefs.splice(i, 1);
  renderRefList();
}

function clearAllRefFiles() {
  _curRefs = [];
  renderRefList();
  if (editingQTypes[selIdx]) {
    editingQTypes[selIdx].references = [];
    editingQTypes[selIdx].reference  = '';
    if (settingsCat === '개인설정') {
      qTypes = JSON.parse(JSON.stringify(editingQTypes));
      persist();
    }
  }
}

// ─── INIT ───
(function init() {
  // Initialize editingQTypes as personal prompts
  editingQTypes = JSON.parse(JSON.stringify(qTypes));

  var m = localStorage.getItem('selectedModel') || localStorage.getItem('geminiModel') || 'gemini-2.5-flash';
  document.getElementById('modelSelect').value = m;
  onModelChange();
  renderSettingsCategoryTabs();
  renderTypeList();
  selectType(0);
  renderPassageList();
  renderQuotaRows();
  renderSeoTypeRows();
  document.getElementById('seoCount').textContent = seoCount;
  renderSetBar();
  renderPromptSetBar();
  renderHistory();
  loadReportsFromSheets();
  initReportQtype();
  renderActiveCategoryDisplay();
  var sel = document.getElementById('activeCategorySelect');
  if (sel) sel.value = activeCategory;

  // Firebase 초기화 (FIREBASE_CONFIG에 값이 있을 때만 동작)
  initFirebase();
  // 이미 인증된 세션이면 저장 방식에 따라 복원
  if (sessionStorage.getItem('seumAuth') === '1') {
    var _initUid = fbUserId();
    if (_initUid && fbDb) {
      // 클라우드 코드: Firebase에서 자동 로드
      setTimeout(function(){ fbPullData(true); }, 800);
    } else if (_initUid && !fbDb) {
      // 클라우드 코드인데 Firebase 미연결 — 재시도 대기
      setSyncStatus('syncing', '☁ 연결 대기 중...');
      setTimeout(function() {
        if (!fbDb) initFirebase();
        if (fbDb && fbUserId()) {
          fbPullData(true);
        } else {
          setSyncStatus('syncerr', '☁ 연결 실패 — 새로고침 필요');
        }
      }, 3000);
    } else {
      // 로컬 코드: 상태 표시만, 공유 학교 프롬프트는 pull
      setSyncStatus('syncno', '💾 로컬 저장');
      if (fbDb) fbPullSharedSchoolPresets();
    }
  }
})();
