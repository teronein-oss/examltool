// ※ 코드를 변경하려면 아래 CODES 배열을 수정하세요
var CODES = ['seum2025', 'english01', 'goT2026', 'manager1', 'manager2', 'manager3', 'user1', 'master_andy'];
var MASTER_CODE = 'master_andy';

// 클라우드 동기화 대상 코드 — 이 코드로 로그인하면 Firebase와 연동되며, 
// 로컬 저장 공간 역시 seum2025 등 일반 사용자와 섞이지 않도록 완전히 독립된(격리된) 키를 씁니다.
var CLOUD_CODES = ['manager1', 'manager2', 'manager3', 'user1'];

var COLORS = ['c1','c2','c3','c4','c5','c6','c7','c8','c9','ca','cb','cc','cd','ce','cf'];
var HEXES  = ['#c0392b','#2980b9','#27ae60','#8e44ad','#d35400','#16a085','#2c3e50','#7f8c8d','#e67e22','#1abc9c','#9b59b6','#34495e','#e74c3c','#3498db','#2ecc71'];

var EXPL = '\nEXPLANATION:\n[정답 근거]: 본문에서 정답의 근거가 되는 핵심 문장 또는 논리 설명\n[오답 분석]:\n② [이 선택지가 틀린 이유]\n③ [이 선택지가 틀린 이유]\n④ [이 선택지가 틀린 이유]\n⑤ [이 선택지가 틀린 이유]';

var DEFAULT_TYPES = [
  { id:'blank', name:'빈칸추론', direction:'다음 빈칸에 들어갈 말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 빈칸 추론 출제 매뉴얼]에 따라 고품질 빈칸 추론 문항 1개를 제작하십시오.\n## 수능 빈칸 추론 출제 매뉴얼\n### 1. 빈칸 위치 및 출제 의도\n- 지문의 핵심 주제(Main Idea) 또는 논리적 귀결을 보여주는 결론부 문장에 빈칸을 설정\n- 빈칸은 ____________________ 로 표시\n### 2. 정답/오답 선지 구성 원리\n- 명시된 표현 그대로 사용 금지, 동의어/추상적 개념으로 Paraphrasing\n- 오답은 키워드 함정, 반대 방향, 논리적 비약, 부분적 사실 기법 사용\n### 3. 정답 번호 배치 규칙 ★\n- ①~⑤ 중 매 문항마다 다른 번호를 랜덤하게 정답으로 설정할 것\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외의 내용은 절대 출력 불가\n2. PASSAGE에는 영어 지문만 출력 (한국어 해석 일체 금지)\n3. 표(Table) 형태 사용 금지, 텍스트로만 해설 작성\n## 출력 형식\nPASSAGE:\n[빈칸이 포함된 출제용 영어 지문]\nDIRECTION:\n다음 빈칸에 들어갈 말로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [①~⑤ 중 정답 번호 하나]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 빈칸에 들어갈 내용과 정답 선지의 논리적 근거를 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'topic', name:'주제', direction:'다음 글의 주제로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 주제 추론 출제 매뉴얼]에 따라 고품질 주제 문항 1개를 제작하십시오.\n## 출제 매뉴얼\n- 정답은 지문을 관통하는 핵심 아이디어를 포괄하는 명사구로 작성\n- 오답은 지엽적 사실, 잘못된 초점, 반대 방향, 과도한 일반화 사용\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 주제로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 지문의 주제와 정답 선지가 연결되는 이유를 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'title', name:'제목', direction:'다음 글의 제목으로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n아래 [수능 제목 추론 출제 매뉴얼]에 따라 고품질 제목 문항 1개를 제작하십시오.\n## 출제 매뉴얼\n- 정답은 핵심 요지를 함축적·비유적으로 표현한 Title Case\n- 오답은 과장, 태도 왜곡, 지엽적 사실 등 활용\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 제목으로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답이 본문 요지를 어떻게 비유적/함축적으로 담아냈는지 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'order', name:'문장 순서', direction:'주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n지문을 주어진 글(INTRO)과 (A), (B), (C) 세 단락으로 분할하십시오.\n## 출제 매뉴얼\n- 접속사보다는 내용 흐름, 대명사, 지시어, 관사 등을 이용해 순서를 추론하도록 출제\n- 선택지는 수능형 5개 고정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. 블록 내 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nINTRO:\n[주어진 글 (영어만)]\nBLOCK_A:\n(A) [A단락]\nBLOCK_B:\n(B) [B단락]\nBLOCK_C:\n(C) [C단락]\nDIRECTION:\n주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은?\nCHOICES:\n① (A)-(C)-(B)\n② (B)-(A)-(C)\n③ (B)-(C)-(A)\n④ (C)-(A)-(B)\n⑤ (C)-(B)-(A)\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 지시어, 대명사, 내용 흐름상 해당 순서가 맞는 이유를 간결하게 설명\n[선택지 해석]:\n① (A)-(C)-(B) 연결 시의 논리적 흐름 간략 해석\n② (B)-(A)-(C) 연결 시의 논리적 흐름 간략 해석\n③ (B)-(C)-(A) 연결 시의 논리적 흐름 간략 해석\n④ (C)-(A)-(B) 연결 시의 논리적 흐름 간략 해석\n⑤ (C)-(B)-(A) 연결 시의 논리적 흐름 간략 해석' },

  { id:'insert', name:'문장 삽입', direction:'글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 영역 출제 위원입니다.\n## 출제 매뉴얼\n- 논리적 단절이 생기거나 지시어/대명사가 가리킬 대상이 사라지는 곳에 삽입 위치 설정\n- 문장이 빠진 자리에 ①②③④⑤ 번호 삽입\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. 영어 지문 내 한국어 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nGIVEN_SENTENCE:\n[삽입할 영어 문장]\nPASSAGE:\n[①②③④⑤ 번호가 포함된 전체 영어 지문]\nDIRECTION:\n글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 적절한 곳은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 주어진 문장이 해당 위치에 들어가야 논리적 단절이나 지시어 모순이 해결되는 이유를 간결하게 설명\n[선택지 해석]:\n① [1번 위치 앞뒤 문맥 간략 해석]\n② [2번 위치 앞뒤 문맥 간략 해석]\n③ [3번 위치 앞뒤 문맥 간략 해석]\n④ [4번 위치 앞뒤 문맥 간략 해석]\n⑤ [5번 위치 앞뒤 문맥 간략 해석]' },

  { id:'grammar', name:'어법', direction:'다음 밑줄 친 부분 중, 어법상 틀린 것은?',
    prompt:'당신은 대한민국 수능 영어 영역 어법 문항 전문 출제자입니다.\n## 출제 매뉴얼\n- 동사/준동사, 분사, 병렬 구조, 대명사 일치 등 수능 빈출 어법 코드 적용\n- 5개의 밑줄 중 1개만 틀린 어법으로 교체하여 정답 설정\n## ★ 출력 절대 규칙\n1. 1문장 1선지 원칙 엄수 (한 문장에 밑줄 2개 이상 불가)\n2. PASSAGE 내 선지 단어 바로 앞에 ①~⑤ 직접 삽입\n3. 표(Table) 형태 사용 금지\n## 출력 형식\nTARGETS:\n(어법 요소 5개 나열. 정답은 \'[원본] -> [오류]\' 형식으로 표기)\nPASSAGE:\n[①②③④⑤ 번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답 선지가 어법상 틀린 이유와 올바른 형태를 간결하게 설명\n[선택지 해석]:\n① [1번 단어/구의 문법적 의미와 쓰임 간략 해석]\n② [2번 단어/구의 문법적 의미와 쓰임 간략 해석]\n③ [3번 단어/구의 문법적 의미와 쓰임 간략 해석]\n④ [4번 단어/구의 문법적 의미와 쓰임 간략 해석]\n⑤ [5번 단어/구의 문법적 의미와 쓰임 간략 해석]' },

  { id:'summary', name:'요약문', direction:'다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 요약문 완성 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문 요약 문장 작성 및 (A), (B) 두 빈칸 생성\n- 정답을 포함한 5개 선지(①~⑤)를 생성\n## ★ 출력 절대 규칙\n1. 표(Table) 형태 사용 금지\n2. PASSAGE 및 SUMMARY에 한국어 해석 일체 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nSUMMARY:\n[빈칸 (A), (B)가 포함된 요약 문장]\nDIRECTION:\n다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?\nCHOICES:\n① (A) ___ (B) ___\n② (A) ___ (B) ___\n③ (A) ___ (B) ___\n④ (A) ___ (B) ___\n⑤ (A) ___ (B) ___\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 요약문의 (A), (B) 빈칸에 해당 단어쌍이 들어가야 하는 핵심 근거를 간결하게 설명\n[선택지 해석]:\n① (A) [단어 뜻] / (B) [단어 뜻]\n② (A) [단어 뜻] / (B) [단어 뜻]\n③ (A) [단어 뜻] / (B) [단어 뜻]\n④ (A) [단어 뜻] / (B) [단어 뜻]\n⑤ (A) [단어 뜻] / (B) [단어 뜻]' },

  { id:'vocab', name:'어휘', direction:'다음 밑줄 친 단어의 쓰임이 적절하지 않은 것은?',
    prompt:'당신은 대한민국 수능 영어 최고난도 어휘 문항 출제자입니다.\n## 출제 매뉴얼\n- 글의 흐름을 보여주는 핵심 어휘 5개 중 1개를 문맥상 틀린 정반대 의미의 단어로 교체\n- 1문장 1선지 원칙 엄수\n## ★ 출력 절대 규칙\n1. PASSAGE 내 선지 단어 바로 앞에 ①~⑤ 삽입. 정답 번호 뒤엔 반드시 틀린 반의어가 와야 함\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nTARGETS:\n(어휘 5개 나열. 정답은 반의어로 표기)\nPASSAGE:\n[①②③④⑤ 번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 않은 것은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 해당 단어가 문맥상 틀린 이유와 반의어로 교체되어야 하는 논리적 근거를 간결하게 설명\n[선택지 해석]:\n① [1번 단어의 의미 및 문맥 해석]\n② [2번 단어의 의미 및 문맥 해석]\n③ [3번 단어의 의미 및 문맥 해석]\n④ [4번 단어의 의미 및 문맥 해석]\n⑤ [5번 단어의 의미 및 문맥 해석]' },

  { id:'irrelevant', name:'무관한 문장', direction:'다음 글에서 전체 흐름과 관계 없는 문장은?',
    prompt:'당신은 대한민국 수능 영어 무관한 문장 찾기 문항 출제자입니다.\n## 출제 매뉴얼\n- 핵심 소재나 앞 문장 키워드를 재사용하되, 주체/대상을 바꾸거나 방향을 뒤집어 논점을 이탈하는 문장 1개를 중간에 추가\n## ★ 출력 절대 규칙\n1. 도입부 이후 ①~⑤ 번호를 각 문장 앞에 직접 표시\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nPASSAGE:\n[번호가 삽입된 전체 영어 지문]\nDIRECTION:\n다음 글에서 전체 흐름과 관계 없는 문장은?\nCHOICES:\n① ② ③ ④ ⑤\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 해당 문장이 글의 전체 흐름에서 어떻게 벗어나는지 간결하게 설명\n[선택지 해석]:\n① [1번 문장 간략 해석]\n② [2번 문장 간략 해석]\n③ [3번 문장 간략 해석]\n④ [4번 문장 간략 해석]\n⑤ [5번 문장 간략 해석]' },

  { id:'implication', name:'함의추론', direction:'다음 글의 밑줄 친 부분이 의미하는 바로 가장 적절한 것은?',
    prompt:'당신은 대한민국 수능 영어 21번 함축 의미 추론 문항 출제자입니다.\n## 출제 매뉴얼\n- 비유적/역설적으로 표현된 구를 밑줄로 선정하고, 직설적으로 패러프레이징한 선지를 정답으로 구성\n- 오답은 키워드 함정, 반대 논리 등 활용\n## ★ 출력 절대 규칙\n1. PASSAGE 내 밑줄 부분 표시\n2. 표(Table) 형태 사용 금지\n## 출력 형식\nPASSAGE:\n[밑줄이 표시된 영어 지문]\nDIRECTION:\n밑줄 친 부분이 다음 글에서 의미하는 바로 가장 적절한 것은?\nCHOICES:\n① [선지]\n② [선지]\n③ [선지]\n④ [선지]\n⑤ [선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 밑줄 친 표현의 함축적 의미와 정답 선지가 논리적으로 연결되는 이유 간결하게 설명\n[선택지 해석]:\n① [1번 선지 해석]\n② [2번 선지 해석]\n③ [3번 선지 해석]\n④ [4번 선지 해석]\n⑤ [5번 선지 해석]' },

  { id:'match', name:'내용 일치', direction:'다음 글의 내용과 일치하지 않는 것은?',
    prompt:'당신은 대한민국 수능(CSAT) 영어 내용 일치(True/False) 문항 출제자입니다.\n## 출제 매뉴얼\n- 지문의 세부 내용을 바탕으로 한글 선택지 5개를 작성하십시오.\n- 4개는 지문 내용과 일치(True), 1개는 일치하지 않는(False) 내용으로 구성하여 정답을 만드시오.\n- 정답 번호는 매번 ①~⑤ 중 랜덤하게 다르게 설정\n## ★ 출력 절대 규칙\n1. 아래 출력 형식 외 내용 불가. PASSAGE에 한국어 절대 금지\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 내용과 일치하지 않는 것은?\nCHOICES:\n① [한글 선지]\n② [한글 선지]\n③ [한글 선지]\n④ [한글 선지]\n⑤ [한글 선지]\nANSWER: [정답 번호]\nEXPLANATION:\n[정답]: [정답 번호]\n[정답인 이유 해설]: 정답 선지가 본문의 어떤 부분과 다른지 짧게 언급\n[선택지 해석]: (본문 문장과의 일치 여부 기술)\n① [1번 선지와 관련된 지문 문장/근거 짧게 요약]\n② [2번 선지와 관련된 지문 문장/근거 짧게 요약]\n③ [3번 선지와 관련된 지문 문장/근거 짧게 요약]\n④ [4번 선지와 관련된 지문 문장/근거 짧게 요약]\n⑤ [5번 선지와 관련된 지문 문장/근거 짧게 요약]' },

  { id:'seo1', name:'서술형1', direction:'[서술형] 주제를 영어로 쓰시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제 전문가입니다.\n## 매뉴얼\n- 지문 주제를 포괄하는 영어 문장 (8~12단어)\n- 정답 문장의 핵심 단어 4~5개를 원형으로 <보기>에 제시\n## ★ 출력 절대 규칙\n1. PASSAGE에 영어 지문만 출력\n2. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[출제용 영어 지문]\nDIRECTION:\n다음 글의 주제를 <조건>에 맞게 작성하시오. [5.0점]\n< 조건 >\no <보기> 단어 모두 사용 (어형 변화 가능)\no 필요한 단어 추가하여 (  )단어로 작성\n< 보기 >\n[단어 나열]\n답 : _________________________________________________________\nMODEL_ANSWER:\n[모범 답안 영문장]\nEXPLANATION:\n[정답]: [모범 답안 영문장]\n[정답인 이유 해설]: 지문 핵심 주제 설명 및 추가/변형된 문법 요소 간결히 설명\n[선택지 해석]: (서술형이므로 지문/정답 우리말 간략 해석으로 대체)\n[정답 문장 해석]' },

  { id:'seo2', name:'서술형2', direction:'[서술형] 요약문의 빈칸 (A)(B)(C)를 영어로 완성하시오.',
    prompt:'당신은 고등학교 영어 내신 최고난도 서술형 출제자입니다.\n## 매뉴얼\n- 지문 논리를 포괄하는 영문장 생성 후 (A)(B)(C) 빈칸 설정\n- 본문 단어를 요약문 구조에 맞게 품사/형태를 변형해야 정답이 되도록 유도\n## ★ 출력 절대 규칙\n1. 표(Table) 사용 금지\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 글의 요지를 주어진 <조건>에 맞게 완성하시오. [6.0점]\nSUMMARY:\n[(A)(B)(C) 빈칸 포함 영문장]\n< 조건 >\no 본문 단어 활용 (품사/어형 변화 필수)\n답 : (A) ____ [2.0점]\n     (B) ____ [2.0점]\n     (C) ____ [2.0점]\nMODEL_ANSWER:\n(A): [정답] (B): [정답] (C): [정답]\nEXPLANATION:\n[정답]: (A) [답], (B) [답], (C) [답]\n[정답인 이유 해설]: 각 빈칸에 해당 본문 단어가 품사/어형 변형되어 들어가야 하는 문법적 논리를 간결히 설명\n[선택지 해석]: (서술형이므로 요약문 우리말 해석으로 대체)\n[요약문 전체 해석]' },

  { id:'seo3', name:'서술형3', direction:'[서술형] 조건에 맞게 영작하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제자입니다.\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n다음 우리말을 조건에 맞게 영작하시오.\n[우리말]: [한국어]\n[조건]: [어휘/구조 조건]\nMODEL_ANSWER:\n[모범 답안 영문장]\nEXPLANATION:\n[정답]: [모범 답안 영문장]\n[정답인 이유 해설]: 주어진 조건이 충족된 구문적/문법적 근거를 간결히 설명\n[선택지 해석]: (생략)' },

  { id:'seo4', name:'서술형4', direction:'[서술형] 질문에 영어로 답하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제자입니다.\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n위 글을 읽고, 질문에 완전한 영어 문장으로 답하시오.\n[질문]: [영어 질문]\nMODEL_ANSWER:\n[모범 답안 영문장]\nEXPLANATION:\n[정답]: [모범 답안 영문장]\n[정답인 이유 해설]: 질문에 대한 답이 본문 어디에서 어떻게 도출되었는지 간결히 설명\n[선택지 해석]: (생략)' },

  { id:'seo5', name:'서술형5', direction:'[서술형] 요약문의 빈칸을 완성하시오.',
    prompt:'당신은 고등학교 영어 내신 서술형 출제자입니다.\n## 출력 형식\nPASSAGE:\n[영어 지문]\nDIRECTION:\n위 글의 내용을 요약할 때, 빈칸에 알맞은 말을 본문에서 찾아 쓰시오.\nSUMMARY:\n[(A), (B) 빈칸 요약문]\nMODEL_ANSWER:\n(A): [답]  (B): [답]\nEXPLANATION:\n[정답]: (A) [답], (B) [답]\n[정답인 이유 해설]: 해당 단어가 요약문 빈칸에 들어가는 논리적 이유 간결히 설명\n[선택지 해석]: (생략)' }
];

// ─── STATE ───
function mergeWithDefaultQTypes(savedTypes) {
  if (!savedTypes) return JSON.parse(JSON.stringify(DEFAULT_TYPES));
  
  // 저장된 목록에 없는 새 유형 자동 병합
  var savedIds = savedTypes.map(function(t){ return t.id; });
  DEFAULT_TYPES.forEach(function(dt) {
    if (savedIds.indexOf(dt.id) < 0) savedTypes.push(JSON.parse(JSON.stringify(dt)));
  });

  // 배열을 DEFAULT_TYPES 순서대로 강제 재정렬 (사용자 화면에서 항상 일관성 유지)
  var orderMap = {};
  DEFAULT_TYPES.forEach(function(dt, idx) { orderMap[dt.id] = idx; });
  savedTypes.sort(function(a, b) {
    var idxA = orderMap[a.id] !== undefined ? orderMap[a.id] : 999;
    var idxB = orderMap[b.id] !== undefined ? orderMap[b.id] : 999;
    if (idxA !== idxB) return idxA - idxB;
    return 0;
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

// 캐시 초기화를 위해 키를 'qTypes_v5'로 업데이트
var qTypes = mergeWithDefaultQTypes(JSON.parse(localStorage.getItem('qTypes_v5') || 'null'));
var passages    = JSON.parse(localStorage.getItem('passages')    || '[]');
var quotas      = JSON.parse(localStorage.getItem('quotas')      || 'null') || {};
var seoCount    = parseInt(localStorage.getItem('seoCount')      || '1');
var seoSelected = JSON.parse(localStorage.getItem('seoSelected') || '["seo1"]');
var promptSets  = JSON.parse(localStorage.getItem('promptSets_v1') || '{}');

var SCHOOL_NAMES = ['동백고', '백현고', '청덕고'];
// schoolPresets is non-isolated (shared across all user codes on same browser)
var schoolPresets = JSON.parse(_originalGetItem.call(localStorage, 'schoolPresets') || '{}');
SCHOOL_NAMES.forEach(function(s) {
  if (!schoolPresets[s]) schoolPresets[s] = JSON.parse(JSON.stringify(DEFAULT_TYPES));
});
function saveSchoolPresets() {
  _originalSetItem.call(localStorage, 'schoolPresets', JSON.stringify(schoolPresets));
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
  var order = ['passages','output','report','settings'];
  var idx = order.indexOf(name);
  if (idx >= 0) document.querySelectorAll('.tab')[idx].classList.add('active');
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
  renderQuotaRows();
  renderSeoTypeRows();
  renderPassageList();
  updateQSum();
  renderActiveCategoryDisplay();
}

function renderActiveCategoryDisplay() {
  var el = document.getElementById('activePromptSetDisplay');
  if (el) {
    var catLabel = activeCategory === '개인설정' ? '개인 프롬프트' : activeCategory;
    el.textContent = '적용 프롬프트: [' + catLabel + ']';
  }
}

// ─── SETTINGS CATEGORY ───
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
}

function renderSettingsCategoryTabs() {
  var tabs = ['동백고', '백현고', '청덕고', '기본설정', '개인설정'];
  var el = document.getElementById('settingsCatTabs');
  if (!el) return;
  el.innerHTML = tabs.map(function(cat) {
    var isSchool = SCHOOL_NAMES.indexOf(cat) >= 0;
    var isActive = cat === settingsCat;
    var style = isActive
      ? 'background:var(--ink);color:#fff;border-color:var(--ink);'
      : 'background:#fff;color:var(--ink2);border-color:var(--bd);';
    var icon = isSchool ? '🏫 ' : (cat === '개인설정' ? '👤 ' : '📋 ');
    return '<button onclick="switchSettingsCat(\'' + cat + '\')" style="padding:7px 16px;border-radius:99px;border:1.5px solid;font-size:13px;font-weight:700;cursor:pointer;font-family:\'Noto Sans KR\',sans-serif;transition:all 0.2s;' + style + '">' + icon + cat + '</button>';
  }).join('');
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
function renderTypeList() {
  document.getElementById('typeListEl').innerHTML = editingQTypes.map(function(t, i) {
    return '<div class="ti' + (i===selIdx?' active':'') + '" onclick="selectType(' + i + ')">' +
      '<div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' +
      '<span class="tname">' + t.name + '</span>' +
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

// ─── MASTER ADMIN ───
function isMaster() {
  return sessionStorage.getItem('seumUserId') === MASTER_CODE;
}

function showMasterAdminSection() {
  var sec = document.getElementById('masterAdminSection');
  if (!sec) return;
  if (isMaster()) {
    sec.style.display = '';
    document.getElementById('adminMaintainPrompt').value = transformPromptMaintain;
    document.getElementById('adminChangePrompt').value   = transformPromptChange;
  } else {
    sec.style.display = 'none';
  }
}

function saveMasterPrompt(mode) {
  if (!isMaster()) return;
  if (mode === 'maintain') {
    var val = document.getElementById('adminMaintainPrompt').value.trim();
    if (!val) { alert('프롬프트가 비어있습니다.'); return; }
    if (val.indexOf('{TEXT}') < 0) { alert('{TEXT} 플레이스홀더가 없습니다. 원본 지문이 삽입될 위치에 {TEXT} 를 추가해주세요.'); return; }
    transformPromptMaintain = val;
    localStorage.setItem('master_transformPrompt_maintain', val);
    alert('✓ 지문 변형(주제유지) 프롬프트가 저장되었습니다.');
  } else {
    var val2 = document.getElementById('adminChangePrompt').value.trim();
    if (!val2) { alert('프롬프트가 비어있습니다.'); return; }
    if (val2.indexOf('{TEXT}') < 0) { alert('{TEXT} 플레이스홀더가 없습니다.'); return; }
    if (val2.indexOf('{DIRECTION}') < 0) { alert('{DIRECTION} 플레이스홀더가 없습니다. 사용자가 입력한 방향이 삽입될 위치에 {DIRECTION} 을 추가해주세요.'); return; }
    transformPromptChange = val2;
    localStorage.setItem('master_transformPrompt_change', val2);
    alert('✓ 지문 변형(주제변형) 프롬프트가 저장되었습니다.');
  }
}

function resetTransformPrompt(mode) {
  if (!isMaster()) return;
  if (!confirm('기본값으로 복원하시겠습니까? 현재 편집 내용이 사라집니다.')) return;
  if (mode === 'maintain') {
    transformPromptMaintain = DEFAULT_TRANSFORM_MAINTAIN;
    localStorage.removeItem('master_transformPrompt_maintain');
    document.getElementById('adminMaintainPrompt').value = DEFAULT_TRANSFORM_MAINTAIN;
    alert('주제유지 프롬프트가 기본값으로 복원되었습니다.');
  } else {
    transformPromptChange = DEFAULT_TRANSFORM_CHANGE;
    localStorage.removeItem('master_transformPrompt_change');
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
  el.innerHTML = passages.map(function(p, i) {
    var sel = '';
    if (!isRand) {
      var opts = '<option value="unselected"' + (p.typeId === 'unselected' ? ' selected' : '') + '>미선택</option>' + getActiveQTypes().map(function(t) {
        return '<option value="' + t.id + '"' + (p.typeId === t.id ? ' selected' : '') + '>' + t.name + '</option>';
      }).join('');
      sel = '<select class="ptsel" onchange="setPassageType(' + i + ',this.value)">' + opts + '</select>';
    }
    return '<div class="pc">' +
      '<div class="pchead"><span class="pnum">' + (i+1) + '</span>' +
      '<span style="font-size:13px;font-weight:600;color:var(--ink2);flex:1">' + (p.title||'제목 없음') + '</span>' + sel + '</div>' +
      '<div class="pprev">' + p.text + '</div>' +
      '<div class="pcfoot" style="flex-wrap:wrap;">' +
      '<button class="mb" onclick="editPassage(' + i + ')">✎ 편집</button>' +
      '<button class="mb" onclick="transformPassage(' + i + ', \'maintain\')" id="btn-tfm-' + i + '">🔄 지문 변형(주제유지)</button>' +
      '<button class="mb" onclick="transformPassage(' + i + ', \'change\')" id="btn-tfc-' + i + '">🔄 지문 변형(주제변형)</button>' +
      '<button class="mb d" onclick="delPassage(' + i + ')">✕ 삭제</button>' +
      '</div></div>';
  }).join('');
}

function renderQuotaRows() {
  var aqt = getActiveQTypes();
  document.getElementById('quotaRows').innerHTML = aqt.filter(function(t){
    return !t.id.startsWith('seo');
  }).map(function(t, i) {
    if (quotas[t.id] === undefined) quotas[t.id] = 0;
    return '<div class="qrow">' +
      '<div class="qtype"><div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' + t.name + '</div>' +
      '<div class="qctrl">' +
      '<button class="qbtn" onclick="chgQ(\'' + t.id + '\',-1)">−</button>' +
      '<div class="qnum" id="q_' + t.id + '">' + quotas[t.id] + '</div>' +
      '<button class="qbtn" onclick="chgQ(\'' + t.id + '\',1)">+</button>' +
      '</div></div>';
  }).join('');
  updateQSum();
}

function renderSeoTypeRows() {
  var seoTypes = getActiveQTypes().filter(function(t){ return t.id.startsWith('seo'); });
  document.getElementById('seoTypeRows').innerHTML = seoTypes.map(function(t) {
    var chk = seoSelected.indexOf(t.id) >= 0 ? ' checked' : '';
    return '<div class="seocbrow">' +
      '<input type="checkbox" id="scb_' + t.id + '" value="' + t.id + '"' + chk + ' onchange="onSeoCheck(this)">' +
      '<label for="scb_' + t.id + '">' + t.name + '</label></div>';
  }).join('');
}

function chgQ(id, d) {
  quotas[id] = Math.max(0, (quotas[id]||0) + d);
  document.getElementById('q_' + id).textContent = quotas[id];
  updateQSum(); persist();
}

function renderManualCount() {
  var aqt = getActiveQTypes();
  var nonSeoTypes = aqt.filter(function(t){ return !t.id.startsWith('seo'); });
  var allSeoTypes = aqt.filter(function(t){ return t.id.startsWith('seo'); });

  // 모든 유형 카운트 (일반 + 서술형 포함)
  var counts = {};
  aqt.forEach(function(t){ counts[t.id] = 0; });
  passages.forEach(function(p){
    var tid = p.typeId || (aqt[0] ? aqt[0].id : '');
    if (counts[tid] !== undefined) counts[tid]++;
    else counts[tid] = 1;
  });

  // 일반 유형 rows
  var rows = nonSeoTypes.map(function(t, i) {
    var n = counts[t.id] || 0;
    var bg  = n > 0 ? 'var(--grs)'  : 'var(--sf2)';
    var col = n > 0 ? 'var(--gr)'   : 'var(--ink3)';
    var op  = n > 0 ? '' : 'opacity:0.45;';
    return '<div class="qrow" style="' + op + '">' +
      '<div class="qtype"><div class="tdot ' + COLORS[i % COLORS.length] + '"></div>' + t.name + '</div>' +
      '<div class="qctrl"><div class="qnum" style="min-width:28px;text-align:center;background:' + bg + ';border-radius:3px;padding:2px 6px;border:1px solid var(--bd);color:' + col + ';font-weight:700;">' + n + '</div></div></div>';
  }).join('');

  // 서술형 rows (랜덤 OFF 시 항상 표시)
  if (allSeoTypes.length) {
    rows += '<div style="margin:10px 0 5px;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:var(--ac);">[서술형] 배정 현황</div>';
    allSeoTypes.forEach(function(t, i) {
      var n = counts[t.id] || 0;
      var bg  = n > 0 ? 'var(--acs)'   : 'var(--sf2)';
      var col = n > 0 ? 'var(--ac)'    : 'var(--ink3)';
      var op  = n > 0 ? '' : 'opacity:0.45;';
      rows += '<div class="qrow" style="' + op + 'border-color:' + (n>0?'#f0c0bb':'var(--bd)') + ';">' +
        '<div class="qtype"><div class="tdot ' + COLORS[(nonSeoTypes.length + i) % COLORS.length] + '"></div>' + t.name + '</div>' +
        '<div class="qctrl"><div class="qnum" style="min-width:28px;text-align:center;background:' + bg + ';border-radius:3px;padding:2px 6px;border:1px solid ' + (n>0?'#f0c0bb':'var(--bd)') + ';color:' + col + ';font-weight:700;">' + n + '</div></div></div>';
    });
  }

  document.getElementById('manualCountRows').innerHTML = rows;
}

function updateQSum() {
  var isRand = document.getElementById('randomToggle').checked;
  var total = isRand
    ? Object.values(quotas).reduce(function(s,v){ return s+v; }, 0)
    : passages.filter(function(p){ return p.typeId !== 'unselected'; }).length;
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
  passages.forEach(function(p) { p.typeId = 'unselected'; });
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
    promptText = transformPromptMaintain.replace('{TEXT}', text);
  } else {
    modeTitle = '주제변형';
    var userDirection = prompt('새로운 주제의 방향을 입력하세요 (선택 사항)\n(예: 기술적 관점에서 긍정적인 내용으로 써 줘. / 입력하지 않으면 AI가 임의로 변경합니다.)', '');
    if (userDirection === null) return; // 취소 버튼

    var directionStr = userDirection.trim() ? ("\n\n[새로운 주제의 방향]\n" + userDirection.trim()) : "\n\n[새로운 주제의 방향]\n(AI가 임의의 다른 관점으로 작성함)";
    promptText = transformPromptChange.replace('{DIRECTION}', directionStr).replace('{TEXT}', text);
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
  passages[i].typeId = typeId; persist();
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
  var pbWrap = document.getElementById('pbWrap');
  if (pbWrap) pbWrap.classList.remove('pulse-glow');
  var lbl = document.getElementById('pbLabel');
  if (lbl) lbl.textContent = '취소됨';
}

function wait(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }

function extractSec(raw, key) {
  var m = raw.match(new RegExp('(?:^|\\n)[ \\t]*' + key + ':[ \\t]*([\\s\\S]*?)(?=\\n[ \\t]*[A-Z][A-Z_]*[ \\t]*:|$)', 'i'));
  return m ? m[1].trim() : '';
}

// 콜론 없는 한국어 섹션 헤더 (< 조건 >, < 보기 >) 추출 — direction 텍스트 내에서 파싱
function extractKorBlock(text, header) {
  var escaped = header.replace(/[<>()\[\]]/g, '\\$&').replace(/\s+/g, '\\s*');
  var stopPat = '(?=<\\s*조건|<\\s*보기|답\\s*[:：]|MODEL_ANSWER|EXPLANATION|$)';
  var m = text.match(new RegExp(escaped + '\\s*\\n?([\\s\\S]*?)' + stopPat, 'i'));
  return m ? m[1].replace(/답\s*[:：][\s_]*/g, '').trim() : '';
}

function toSections(num, type, raw, passageTitle) {
  if (!raw) return { q:'[' + num + '번 생성 실패]\n\n', a:'' };
  var passage  = extractSec(raw,'PASSAGE') || extractSec(raw,'INTRO') || '';
  var intro    = extractSec(raw,'INTRO')   || '';
  var bA       = extractSec(raw,'BLOCK_A') || '';
  var bB       = extractSec(raw,'BLOCK_B') || '';
  var bC       = extractSec(raw,'BLOCK_C') || '';
  var given    = extractSec(raw,'GIVEN_SENTENCE') || '';
  var summary  = extractSec(raw,'SUMMARY')  || '';
  var direction= extractSec(raw,'DIRECTION')|| type.direction;
  var choices  = (extractSec(raw,'CHOICES')||'').split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤]/); });
  var answer   = extractSec(raw,'ANSWER')   || '';
  var expl     = extractSec(raw,'EXPLANATION') || '';
  var modelAns = extractSec(raw,'MODEL_ANSWER') || '';
  // 서술형1 특수 섹션
  var condSec  = extractSec(raw,'< 조건 >') || extractSec(raw,'조건') || '';
  var exampleSec = extractSec(raw,'< 보기 >') || extractSec(raw,'보기') || '';
  var DIV = '\u2500'.repeat(60);

  var hasContent = !!(passage || intro || bA || given || summary);
  if (!choices.length) {
    choices = raw.split('\n').filter(function(l){ return l.trim().match(/^[①②③④⑤]/); });
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

  } else if (type.id === 'seo1') {
    // 서술형1: DIRECTION 텍스트 자체에 <조건>/<보기>가 포함되어 있으므로 그 안에서 분리
    // DIRECTION = "지시문\n< 조건 >\n...\n< 보기 >\n...\n답 : ___"
    var seo1Full = direction; // extractSec(DIRECTION)이 MODEL_ANSWER 직전까지 전부 캡처
    // 1) 지시문: < 조건 > 이전 텍스트
    var condIdx1 = seo1Full.search(/<\s*조건\s*>/);
    var seo1Instr = (condIdx1 >= 0 ? seo1Full.substring(0, condIdx1) : seo1Full)
      .replace(/답\s*[:：][\s_]*/g, '').trim();
    // 2) < 조건 > 블록 — direction 텍스트 내에서 추출
    var condBlock  = extractKorBlock(seo1Full, '< 조건 >');
    // 3) < 보기 > 블록
    var exBlock    = extractKorBlock(seo1Full, '< 보기 >');
    // 출력 순서: 지시문 → 지문 → <조건> → <보기> → 답란
    q.push(seo1Instr || seo1Full.replace(/답\s*[:：][\s_]*/g, '').trim()); q.push('');
    if (passage) { q.push(passage); q.push(''); }
    if (condBlock) { q.push('< 조건 >'); q.push(condBlock); q.push(''); }
    if (exBlock)   { q.push('< 보기 >'); q.push(exBlock);   q.push(''); }
    q.push('답 : _________________________________________________________'); q.push('');

  } else if (type.id === 'seo2') {
    // 서술형2: DIRECTION 안에서 <조건> 분리
    var seo2Full = direction;
    var condIdx2 = seo2Full.search(/<\s*조건\s*>/);
    var seo2Instr = (condIdx2 >= 0 ? seo2Full.substring(0, condIdx2) : seo2Full)
      .replace(/답\s*[:：][\s_]*/g, '').replace(/\(A\)[\s_]*/g, '').trim();
    var condBlock2 = extractKorBlock(seo2Full, '< 조건 >');
    // 출력 순서: 지시문 → <조건> → 지문 → 요약문 → 답란
    q.push(seo2Instr || seo2Full.replace(/답\s*[:：][\s_]*/g, '').trim()); q.push('');
    if (condBlock2) { q.push('< 조건 >'); q.push(condBlock2); q.push(''); }
    if (passage)    { q.push(passage); q.push(''); }
    if (summary)    { q.push(summary); q.push(''); }
    q.push('답 : (A) ____________________ [2.0점]');
    q.push('     (B) ____________________ [2.0점]');
    q.push('     (C) ____________________ [2.0점]'); q.push('');

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

  } else if (type.id === 'insert') {
    q.push(direction); q.push('');
    if (given)   { q.push('주어진 문장: ' + given); q.push(''); }
    if (passage) { q.push(passage); q.push(''); }
    choices.forEach(function(c){ q.push(c); }); q.push('');

  } else if (type.id === 'summary' || type.id === 'seo5') {
    var seo5Dir = direction.replace(/답\s*[:：][\s_]*/g, '').trim();
    q.push(seo5Dir); q.push('');
    if (passage) { q.push(passage); q.push(''); }
    if (summary) { q.push('요약: ' + summary); q.push(''); }
    if (!type.id.startsWith('seo')) {
      choices.forEach(function(c){ q.push(c); }); q.push('');
    } else {
      q.push('답: _________________________________________________'); q.push('');
    }

  } else if (type.id.startsWith('seo')) {
    var seoFull = direction;
    var seoCondIdx = seoFull.search(/<\s*조건\s*>/);
    var seoInstr = (seoCondIdx >= 0 ? seoFull.substring(0, seoCondIdx) : seoFull)
      .replace(/답\s*[:：][\s_]*/g, '').trim();
    var seoCondBlock = extractKorBlock(seoFull, '< 조건 >');
    q.push(seoInstr || seoFull.replace(/답\s*[:：][\s_]*/g, '').trim()); q.push('');
    if (passage) { q.push(passage); q.push(''); }
    if (seoCondBlock) { q.push('< 조건 >'); q.push(seoCondBlock); q.push(''); }
    q.push('답: _________________________________________________'); q.push('');

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

  q.push(DIV); q.push('');

  // ── 해설부 ──
  var a = [];
  a.push('[' + num + '번 해설] [' + type.name + ']' + (passageTitle ? ' (' + passageTitle + ')' : '')); a.push('');
  if (answer) { a.push('\u25b6 정답: ' + answer.trim()); a.push(''); }
  if (type.id.startsWith('seo')) {
    if (modelAns) { a.push('\u25b6 모범 답안:'); a.push(modelAns); a.push(''); }
    a.push(expl || '[채점 기준 없음]');
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
  var prompt = getFixedFormat(type.id) + hint + refSection + '\n\n## 추가 출제 지침\n' + type.prompt + '\n\n[원본 지문]\n' + passageText;

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
    var res2 = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents:[{parts:[{text: prompt}]}],
          generationConfig:{maxOutputTokens:4000, temperature:0.7}
        })
      }
    );
    if (!res2.ok) {
      var e2 = await res2.json().catch(function(){ return {}; });
      throw new Error(e2.error && e2.error.message ? e2.error.message : 'HTTP ' + res2.status);
    }
    var data2 = await res2.json();
    return (data2.candidates && data2.candidates[0] && data2.candidates[0].content &&
      data2.candidates[0].content.parts && data2.candidates[0].content.parts[0])
      ? data2.candidates[0].content.parts[0].text : '';
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
    // 랜덤 OFF: 지문 카드 배정 그대로 사용 (서술형 포함)
    passages.forEach(function(p) {
      if (p.typeId !== 'unselected') {
        assignment.push({ passage: p, typeId: p.typeId || getActiveQTypes()[0].id });
      }
    });
  }

  if (!assignment.length) { alert('생성할 문항이 없습니다. 문항 수를 설정해주세요.'); return; }

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
    var _aqt = getActiveQTypes();
    for (var j=0; j<_aqt.length; j++) { if (_aqt[j].id === item.typeId) { type = _aqt[j]; break; } }
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
  seoSelected = JSON.parse(localStorage.getItem('seoSelected') || '["seo1"]');
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
      // 로컬 코드: 상태 표시만
      setSyncStatus('syncno', '💾 로컬 저장');
    }
  }
})();
