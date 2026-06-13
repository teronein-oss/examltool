#!/usr/bin/env python3
"""
요약문 빈칸4개 문항 자동 검증 스크립트
메타프롬프트 v1.2 — 백현2 교과서 요약문 빈칸4개 유형

사용법:
  python3 validator.py question.txt          # 텍스트 파일 검증
  python3 validator.py q1.txt q2.txt ...     # 다수 파일 일괄 검증
  python3 validator.py --demo                # 내장 샘플 5문항 (알려진 이슈 탐지 확인)
  cat question.txt | python3 validator.py -  # 파이프 입력

입력 파일 형식:
  PASSAGE:
  [본문 텍스트]

  DIRECTION:
  [지시문]

  SUMMARY:
  [요약문 — 빈칸 (A)(B)(C)(D) 포함]

  MODEL_ANSWER:
  (A): [정답]
  (B): [정답]
  (C): [정답]
  (D): [정답]

  EXPLANATION:
  (A) 정답: ...
  출처 문장: ...
  난이도: ★☆☆
  출제 의도: ...
  [B, C, D 동일 형식]
"""

import re
import sys
import ssl
import string
import argparse
from dataclasses import dataclass, field
from typing import Optional
from collections import Counter

# macOS SSL 인증서 문제 해결
ssl._create_default_https_context = ssl._create_unverified_context

# ── NLP 초기화 ────────────────────────────────────────────
HAS_NLTK = False
stemmer = None
_pos_tagger_available = False

try:
    import nltk
    from nltk.stem import PorterStemmer
    from nltk.tokenize import word_tokenize

    _REQUIRED = {
        'tokenizers/punkt_tab': 'punkt_tab',
        'taggers/averaged_perceptron_tagger_eng': 'averaged_perceptron_tagger_eng',
    }
    for path, name in _REQUIRED.items():
        try:
            nltk.data.find(path)
        except LookupError:
            nltk.download(name, quiet=True)

    stemmer = PorterStemmer()
    HAS_NLTK = True

    # POS 태거 사용 가능 여부 별도 확인
    try:
        nltk.pos_tag(['test'])
        _pos_tagger_available = True
    except Exception:
        pass

except ImportError:
    print("[INFO] nltk 미설치 — 형태소/품사 검사 비활성. 설치: pip install nltk", file=sys.stderr)


# ── 데이터 클래스 ──────────────────────────────────────────
@dataclass
class QuestionItem:
    title: str = ""
    passage: str = ""
    direction: str = ""
    summary: str = ""
    answers: dict = field(default_factory=dict)  # {'A': ..., 'B': ..., 'C': ..., 'D': ...}
    explanation: str = ""
    raw: str = ""


@dataclass
class CheckResult:
    name: str
    passed: bool
    message: str
    severity: str = "ERROR"   # ERROR | WARNING | INFO


# ── 파서 ──────────────────────────────────────────────────
def parse_question(text: str, title: str = "") -> QuestionItem:
    """텍스트를 QuestionItem으로 파싱한다."""
    item = QuestionItem(title=title, raw=text)

    section_re = re.compile(
        r'^(PASSAGE|DIRECTION|SUMMARY|MODEL_ANSWER|EXPLANATION)\s*:\s*\n',
        re.MULTILINE,
    )
    matches = list(section_re.finditer(text))

    for i, m in enumerate(matches):
        name = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()

        if name == 'PASSAGE':
            item.passage = content
        elif name == 'DIRECTION':
            item.direction = content
        elif name == 'SUMMARY':
            item.summary = content
        elif name == 'MODEL_ANSWER':
            for line in content.splitlines():
                m2 = re.match(r'\(([ABCD])\)\s*[:：]\s*(.+)', line.strip())
                if m2:
                    item.answers[m2.group(1)] = m2.group(2).strip()
        elif name == 'EXPLANATION':
            item.explanation = content

    return item


# ── 형태소 유틸 ───────────────────────────────────────────
def _stem(word: str) -> str:
    if stemmer:
        return stemmer.stem(word.lower())
    return word.lower()


def _tokenize(text: str) -> list[str]:
    """구두점 제거 후 소문자 토큰 리스트 반환."""
    return [w.lower().strip(string.punctuation) for w in text.split()
            if w.strip(string.punctuation)]


def _morphologically_related(a: str, b: str) -> bool:
    """두 단어가 형태론적으로 관련 있는지 판단한다.
    (exact match / stem match / 4자+ 부분 문자열 포함 여부)
    """
    a, b = a.lower().strip(string.punctuation), b.lower().strip(string.punctuation)
    if not a or not b:
        return False
    if a == b:
        return True
    if stemmer and _stem(a) == _stem(b):
        return True
    # substring: cost ↔ costly, burden ↔ burdensome 등 파생 관계 포착
    if len(a) >= 4 and len(b) >= 4 and (a in b or b in a):
        return True
    return False


# ── 개별 검증 함수 ────────────────────────────────────────

def chk_blank_count(item: QuestionItem) -> CheckResult:
    """SUMMARY 내 빈칸이 정확히 (A)(B)(C)(D) 4개인지 확인."""
    found = set(re.findall(r'\([ABCD]\)', item.summary))
    ok = found == {'(A)', '(B)', '(C)', '(D)'}
    return CheckResult(
        "빈칸 개수",
        ok,
        "정확히 4개 확인됨" if ok else f"오류 — 발견: {sorted(found)} (4개 필요)",
    )


def chk_d_word_count(item: QuestionItem) -> CheckResult:
    """(D) 정답이 정확히 1단어인지 확인."""
    d = item.answers.get('D', '')
    if not d:
        return CheckResult("(D) 단어 수", False, "(D) 정답 없음")
    n = len(d.split())
    return CheckResult(
        "(D) 단어 수",
        n == 1,
        f"(D)='{d}' — {n}단어" + ("" if n == 1 else " ← 1단어 초과 위반"),
    )


def chk_abc_word_count(item: QuestionItem) -> CheckResult:
    """(A)(B)(C) 정답이 1~2단어 이내인지 확인."""
    violations = []
    for key in ['A', 'B', 'C']:
        ans = item.answers.get(key, '')
        n = len(ans.split())
        if n > 2:
            violations.append(f"({key})='{ans}' ({n}단어)")
    return CheckResult(
        "(A)(B)(C) 단어 수",
        not violations,
        "모두 1~2단어" if not violations else "위반: " + ", ".join(violations),
    )


def chk_summary_word_count(item: QuestionItem) -> CheckResult:
    """SUMMARY가 60~80단어인지 확인."""
    clean = re.sub(r'\([ABCD]\)', 'BLANK', item.summary)
    n = len(clean.split())
    ok = 60 <= n <= 80
    return CheckResult(
        "SUMMARY 단어 수",
        ok,
        f"{n}단어" + ("" if ok else " (60~80 범위 벗어남)"),
        severity="WARNING" if not ok else "INFO",
    )


def chk_passage_word_count(item: QuestionItem) -> CheckResult:
    """PASSAGE가 220~260단어인지 확인."""
    if not item.passage:
        return CheckResult("PASSAGE 단어 수", False, "PASSAGE 없음", severity="WARNING")
    n = len(item.passage.split())
    ok = 220 <= n <= 260
    return CheckResult(
        "PASSAGE 단어 수",
        ok,
        f"{n}단어" + ("" if ok else " (220~260 범위 벗어남)"),
        severity="WARNING" if not ok else "INFO",
    )


def chk_d_not_in_passage(item: QuestionItem) -> CheckResult:
    """(D) 정답의 어근/파생어가 PASSAGE에 등장하지 않는지 확인.
    원형·활용형·파생어(어근 공유) 전수 검사.
    """
    if not item.passage:
        return CheckResult("(D) PASSAGE 비등장", False, "PASSAGE 없음 — 검증 불가", severity="WARNING")
    d = item.answers.get('D', '')
    if not d:
        return CheckResult("(D) PASSAGE 비등장", False, "(D) 정답 없음")

    d_tokens = _tokenize(d)
    p_tokens = _tokenize(item.passage)

    hits = []
    for dw in d_tokens:
        for pw in p_tokens:
            if _morphologically_related(dw, pw):
                hits.append(f"'{dw}' ↔ '{pw}'")
    # 중복 제거 (같은 pw가 여러 번 나올 수 있으므로)
    hits = list(dict.fromkeys(hits))

    if hits:
        return CheckResult(
            "(D) PASSAGE 비등장",
            False,
            f"(D)='{d}' 의 어근/파생어가 PASSAGE에서 발견됨: {', '.join(hits[:4])}",
        )
    return CheckResult("(D) PASSAGE 비등장", True, f"(D)='{d}' — PASSAGE에 미등장 확인")


def chk_abc_in_passage(item: QuestionItem) -> list[CheckResult]:
    """(A)(B)(C) 정답이 PASSAGE에 어형 포함 실제 존재하는지 확인."""
    if not item.passage:
        return [
            CheckResult(f"({k}) PASSAGE 출처", False, "PASSAGE 없음 — 검증 불가", severity="WARNING")
            for k in ['A', 'B', 'C']
        ]

    p_tokens = _tokenize(item.passage)
    results = []

    for key in ['A', 'B', 'C']:
        ans = item.answers.get(key, '')
        if not ans:
            results.append(CheckResult(f"({key}) PASSAGE 출처", False, f"({key}) 정답 없음"))
            continue

        missing = [aw for aw in _tokenize(ans)
                   if not any(_morphologically_related(aw, pw) for pw in p_tokens)]

        results.append(CheckResult(
            f"({key}) PASSAGE 출처",
            not missing,
            (f"({key})='{ans}' — PASSAGE 출처 확인됨"
             if not missing
             else f"({key})='{ans}' — PASSAGE에서 미발견: {missing}"),
        ))
    return results


def chk_duplicate_on_insertion(item: QuestionItem) -> list[CheckResult]:
    """정답을 SUMMARY에 삽입했을 때 인접 단어(좌우 4단어 이내) 중복 발생 여부 탐지."""
    results = []
    summary = item.summary

    for key in ['A', 'B', 'C', 'D']:
        ans = item.answers.get(key, '')
        if not ans:
            continue

        # 정답 삽입본 생성
        inserted = re.sub(re.escape(f'({key})'), ans, summary)
        words = [w.strip(string.punctuation) for w in inserted.lower().split()]
        ans_tokens = [w.strip(string.punctuation) for w in ans.lower().split()]

        dups = []
        for aw in ans_tokens:
            if len(aw) < 3:
                continue
            # 전체 삽입본에서 해당 단어의 등장 위치 수집
            positions = [i for i, w in enumerate(words) if w == aw]
            for j in range(len(positions) - 1):
                gap = positions[j + 1] - positions[j] - 1  # 사이 단어 수
                if gap <= 4:
                    ctx = ' '.join(words[max(0, positions[j] - 1):positions[j + 1] + 2])
                    dups.append(f"'{aw}' 중복 (사이 {gap}단어): ...{ctx}...")

        results.append(CheckResult(
            f"({key}) 삽입 중복",
            not dups,
            (f"({key})='{ans}' — 중복 없음"
             if not dups
             else f"({key})='{ans}' 삽입 시 중복: {dups[0]}"),
        ))

    return results


def chk_explanation(item: QuestionItem) -> CheckResult:
    """EXPLANATION 섹션에 (A)~(D) 4개 블록과 4항목(정답/출처/난이도/의도)이 있는지 확인."""
    if not item.explanation.strip():
        return CheckResult("EXPLANATION 완성도", False, "EXPLANATION 섹션 자체가 누락됨")

    issues = []
    for key in ['A', 'B', 'C', 'D']:
        # 해당 키의 블록 범위 추출
        pat = re.compile(
            rf'\({key}\).*?(?=\([ABCD]\)\s|$)',
            re.DOTALL,
        )
        m = pat.search(item.explanation)
        block = m.group(0) if m else ''

        if not block:
            issues.append(f"({key}) 블록 없음")
            continue

        for field_name, pattern in [
            ('정답', r'정답'),
            ('출처 문장', r'출처'),
            ('난이도', r'난이도'),
            ('출제 의도', r'출제|의도'),
        ]:
            if not re.search(pattern, block):
                issues.append(f"({key}) {field_name} 없음")

    return CheckResult(
        "EXPLANATION 완성도",
        not issues,
        "4개 블록 × 4항목 모두 확인됨" if not issues else "누락: " + ", ".join(issues),
    )


def chk_direction_dual(item: QuestionItem) -> CheckResult:
    """DIRECTION이 (A)~(C)는 '본문에서 찾아', (D)는 '본문에 없는 단어'로 이원화되었는지 확인."""
    has_abc = bool(re.search(r'본문에서 찾', item.direction))
    has_d = bool(re.search(r'본문에 사용되지 않|본문에 직접 등장하지 않', item.direction))
    ok = has_abc and has_d
    if not item.direction.strip():
        return CheckResult("DIRECTION 이원화", False, "DIRECTION 섹션 없음", severity="WARNING")
    return CheckResult(
        "DIRECTION 이원화",
        ok,
        ("(A)~(C) / (D) 분리 지시 확인됨" if ok
         else "(D) 별도 지시문 없음 — '본문에 사용되지 않은 단어' 문구 필요"),
        severity="WARNING" if not ok else "INFO",
    )


def chk_pos_distribution(item: QuestionItem) -> CheckResult:
    """4개 빈칸 정답의 품사 분산 확인 (동일 품사 3개 이상 금지).
    NLP 품사 태깅 기반 — 경고(WARNING) 수준으로 처리.
    """
    if not (_pos_tagger_available and HAS_NLTK):
        return CheckResult(
            "품사 분산",
            True,
            "POS 태거 미사용 — 품사 검사 건너뜀",
            severity="INFO",
        )

    # 광의의 품사 분류 (한국 영어 교육 맥락)
    POS_CATEGORY = {
        'JJ': '형용사', 'JJR': '형용사', 'JJS': '형용사',
        'VBN': '형용사계열',  # past participle (often adjectival)
        'VBG': '형용사계열',  # gerund/participle (often adjectival)
        'NN': '명사', 'NNS': '명사', 'NNP': '명사', 'NNPS': '명사',
        'VB': '동사', 'VBD': '동사', 'VBP': '동사', 'VBZ': '동사',
        'RB': '부사', 'RBR': '부사', 'RBS': '부사',
    }

    tagged_results = {}
    for key in ['A', 'B', 'C', 'D']:
        ans = item.answers.get(key, '')
        if not ans:
            continue
        tokens = word_tokenize(ans)
        tagged = nltk.pos_tag(tokens)
        # 핵심어: 다단어 정답은 마지막 단어 (명사구 head)
        head_tag = tagged[-1][1] if tagged else 'NN'
        category = POS_CATEGORY.get(head_tag, head_tag)
        tagged_results[key] = (ans, category, head_tag)

    # 형용사 + 형용사계열을 묶어서 계산 (교육 문법상 동일 취급)
    def normalized(cat: str) -> str:
        return '형용사류' if cat in ('형용사', '형용사계열') else cat

    norm_counts = Counter(normalized(v[1]) for v in tagged_results.values())
    violations = {cat: cnt for cat, cnt in norm_counts.items() if cnt >= 3}

    detail = ", ".join(f"({k})='{v[0]}'({v[1]})" for k, v in tagged_results.items())

    if violations:
        viol_str = ", ".join(f"{cat} {cnt}개" for cat, cnt in violations.items())
        return CheckResult(
            "품사 분산",
            False,
            f"동일 품사 3개 이상: {viol_str} | {detail}",
            severity="WARNING",
        )
    return CheckResult("품사 분산", True, f"품사 분산 양호 | {detail}", severity="INFO")


# ── 전체 검증 실행 ─────────────────────────────────────────
def run_all_checks(item: QuestionItem) -> list[CheckResult]:
    results: list[CheckResult] = []
    results.append(chk_blank_count(item))
    results.append(chk_d_word_count(item))
    results.append(chk_abc_word_count(item))
    results.append(chk_summary_word_count(item))
    results.append(chk_passage_word_count(item))
    results.append(chk_d_not_in_passage(item))
    results.extend(chk_abc_in_passage(item))
    results.extend(chk_duplicate_on_insertion(item))
    results.append(chk_explanation(item))
    results.append(chk_direction_dual(item))
    results.append(chk_pos_distribution(item))
    return results


def report(item: QuestionItem, results: list[CheckResult], verbose: bool = False) -> tuple[int, int]:
    errors = [r for r in results if not r.passed and r.severity == 'ERROR']
    warnings = [r for r in results if not r.passed and r.severity == 'WARNING']

    status = "PASS" if not errors else "FAIL"
    warn_tag = f" [{len(warnings)} WARN]" if warnings else ""

    print(f"\n{'═' * 64}")
    print(f"  {status}{warn_tag}  {item.title}")
    print(f"{'═' * 64}")

    shown = 0
    for r in results:
        if r.severity == 'INFO' and not verbose:
            continue
        icon = "✓" if r.passed else ("⚠" if r.severity == "WARNING" else "✗")
        prefix = "  " if r.passed else "  "
        print(f"{prefix}{icon} {r.name}: {r.message}")
        shown += 1

    if shown == 0:
        print("  (모든 검증 통과 — 세부 내용은 --verbose 옵션 참고)")

    return len(errors), len(warnings)


# ── 내장 데모 샘플 ─────────────────────────────────────────
# 이슈 문서(2026.06.13) 기반 5문항 — 알려진 결함이 탐지되는지 검증용.
# PASSAGE는 핵심 트리거 어휘가 포함된 대표 발췌문으로 작성됨.

DEMO_SAMPLES = [

    # ── Q1 (5과_2) ──────────────────────────────────────────
    # 알려진 이슈: (B) "prepared...prepared" 중복 / (A)(B)(C) 형용사류 3개
    """\
PASSAGE:
Astronauts aboard the International Space Station encounter extraordinary
challenges that demand rigorous physical and psychological adaptation. Without
the familiar cues of Earth's gravity, they must follow a meticulously prepared
daily agenda transmitted by ground controllers to maintain cognitive stability
and operational readiness. Microgravity distorts every routine task, from
hydration to sleep orientation, rendering ordinary activities surprisingly
complex. Crew members additionally report psychological distress during
extravehicular activities, where the vast silence of open space heightens
feelings of isolation. Despite these adversities, space agencies invest
heavily in countermeasures — structured exercise regimes, cognitive support
protocols, and real-time communication access — designed to preserve
astronaut wellbeing throughout long-duration missions. The cumulative toll
of these pressures can expose a latent human fragility that ground-based
training rarely anticipates, underscoring the importance of comprehensive
pre-mission psychological screening and in-flight resilience programs.

DIRECTION:
윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오. 빈칸 (D)에는 본문에 제시된 내용을 종합하여, 본문에 사용되지 않은 단어를 1단어로 쓰시오.

SUMMARY:
Astronauts face (A) challenges that require both physical and mental
adaptation, following a (B) daily agenda prepared by ground controllers to
maintain stability. The experience of (C) distress during spacewalks and
the disruption of routine tasks highlight a profound (D) that intensive
training alone cannot fully address.

MODEL_ANSWER:
(A): extraordinary
(B): meticulously prepared
(C): psychological
(D): vulnerability

EXPLANATION:
""",

    # ── Q2 (5과_3) ──────────────────────────────────────────
    # 알려진 이슈: (D) "sensations" PASSAGE에 그대로 등장 / (C) "resistant of" 비문
    """\
PASSAGE:
The return journey from the International Space Station presents a perilous
descent through Earth's atmosphere, during which astronauts must endure
extreme forces of re-entry while their bodies remain debilitated by months
of microgravity exposure. Upon landing, crew members frequently struggle
to walk unassisted, as their vestibular systems have fundamentally
re-calibrated to the sensation-free environment of space. Conducting
extravehicular activities during a mission exposes astronauts to
micrometeoroids and radiation, requiring suits engineered to be resistant
to incoming objects at high velocity. Perhaps most surprisingly, returning
astronauts describe an overwhelming emotional response to rediscovering
simple earthly physical sensations proved overwhelming — the weight of
rain on skin, the scent of vegetation, the feel of wind — sensory
experiences that space entirely eliminates.

DIRECTION:
윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오. 빈칸 (D)에는 본문에 제시된 내용을 종합하여, 본문에 사용되지 않은 단어를 1단어로 쓰시오.

SUMMARY:
Astronauts face a (A) descent back to Earth, completing (B) in space
while remaining though (C) of incoming objects. Upon return, they are
overwhelmed by simple earthly (D) such as scent, wind, and rain that
had been absent throughout their mission.

MODEL_ANSWER:
(A): perilous
(B): extravehicular activities
(C): resistant
(D): sensations

EXPLANATION:
""",

    # ── Q3 (9-1) ──────────────────────────────────────────
    # 알려진 이슈: (A) "inclined" PASSAGE에 출처 없음 (gravitate만 존재)
    # 주의: PASSAGE에 "bonds/bond"가 없어야 D=bond 위반이 발생하지 않음
    """\
PASSAGE:
Research into social dynamics reveals that people naturally gravitate toward
communities whose members share their values, beliefs, and cultural
backgrounds. This clustering tendency produces adverse consequences for
democratic societies: as like-minded individuals reinforce one another's
perspectives, the polarization observed between ideologically distinct
groups intensifies markedly. Social media algorithms amplify this
fragmentation by preferentially surfacing content that confirms existing
biases, reducing exposure to countervailing viewpoints. For individuals
seeking communal identity, belonging to a cohesive group provides
psychological security; yet at a societal level, such cohesive units can
calcify into barriers that obstruct meaningful cross-group dialogue.
Addressing this tension requires deliberate institutional interventions —
educational curricula promoting perspective-taking, platforms designed to
surface diverse viewpoints, and community initiatives that create structured
cross-group contact.

DIRECTION:
윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오. 빈칸 (D)에는 본문에 제시된 내용을 종합하여, 본문에 사용되지 않은 단어를 1단어로 쓰시오.

SUMMARY:
People are (A) to cluster with like-minded individuals, leading to (B)
outcomes such as intensified group division. Societal (C) grows as
algorithm-driven platforms limit exposure to diverse perspectives, making
a shared (D) an essential yet elusive foundation for healthy democratic
communities.

MODEL_ANSWER:
(A): inclined
(B): adverse
(C): polarization
(D): bond

EXPLANATION:
(A) 정답: inclined
출처 문장: people naturally gravitate toward communities whose members share their values
난이도: ★☆☆
출제 의도: 본문의 "gravitate toward"를 "inclined to"로 환언한 표현 파악.

(B) 정답: adverse
출처 문장: This clustering tendency produces adverse consequences for democratic societies
난이도: ★★☆
출제 의도: 요약문의 "leading to (B) outcomes"와 본문의 "produces adverse consequences" 대응 파악.

(C) 정답: polarization
출처 문장: the polarization observed between ideologically distinct groups intensifies markedly
난이도: ★★☆
출제 의도: 주제 핵심어 직접 추출.

(D) 정답: bond
출처 문장: belonging to a cohesive group provides psychological security; such bonds can calcify into barriers
난이도: ★★★
출제 의도: 본문의 구체적 집단 소속 표현들을 "bond"로 일반화하는 추론 요구.
""",

    # ── Q4 (9-2) ──────────────────────────────────────────
    # 알려진 이슈: (D) "cost"가 PASSAGE의 "costly"와 어근 공유
    """\
PASSAGE:
A pervasive misconception holds that artificial intelligence systems can
eliminate discrimination from decision-making simply by removing explicitly
labelled demographic variables from training datasets. Critics of this view
demonstrate, however, that even training data constructed to be entirely
neutral with respect to protected characteristics can encode historical
inequalities through proxy variables — zip codes, purchasing histories,
or educational credentials — that correlate strongly with race or gender.
Only when training data is deliberately curated so that only biased
training data causes bias does the problem become tractable; yet achieving
such curation at scale proves prohibitively costly. The commercial cost
differences between deploying biased versus unbiased systems — factoring in
litigation risk, regulatory penalties, and reputational damage — ultimately
compel organizations to invest in fairness-auditing infrastructure despite
its significant financial burden.

DIRECTION:
윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오. 빈칸 (D)에는 본문에 제시된 내용을 종합하여, 본문에 사용되지 않은 단어를 1단어로 쓰시오.

SUMMARY:
Attempts to eliminate (A) from AI systems by using training data that is
entirely (B) often fail, because proxy variables still encode historical
inequalities. The finding that only (C) training data causes bias, combined
with the prohibitive commercial (D) of fair curation, pressures
organizations to invest in fairness-auditing infrastructure.

MODEL_ANSWER:
(A): discrimination
(B): neutral
(C): biased
(D): cost

EXPLANATION:
""",

    # ── Q5 (9-3) ──────────────────────────────────────────
    # 알려진 이슈: (B)(C)(D) 명사 3개 품사 위반
    # 주의: PASSAGE에 "debate"가 없어야 D=debate 위반이 발생하지 않음
    """\
PASSAGE:
The common cold imposes both physical and economic burdens on individuals
and healthcare systems alike, yet its etiology and optimal treatment remain
subjects of ongoing scientific inquiry. Individual susceptibility to
infection varies considerably: nutritional status, sleep quality, and
pre-existing immune conditions modulate the probability of contracting
a rhinovirus after exposure. The severity of cold symptoms — ranging from
mild nasal congestion to fever and pronounced fatigue — is similarly
heterogeneous, influenced by viral load, host immune response, and
concurrent stressors. Despite widespread cultural beliefs associating
cold exposure with increased infection risk, controlled studies have
consistently failed to establish a direct causal link between low ambient
temperature and rhinovirus transmission rates. This gap between folk
wisdom and clinical evidence underscores the importance of scientifically
rigorous investigation into everyday health assumptions.

DIRECTION:
윗글의 내용을 다음과 같이 요약하고자 한다. 빈칸 (A)~(C)에 들어갈 알맞은 말을 본문에서 찾아 각각 1~2단어로 쓰시오. 빈칸 (D)에는 본문에 제시된 내용을 종합하여, 본문에 사용되지 않은 단어를 1단어로 쓰시오.

SUMMARY:
The common cold creates both physical and (A) burdens, though individual
(B) to infection and the (C) of symptoms vary widely across patients.
The relationship between cold temperatures and infection risk remains a
subject of (D) among scientists, as controlled research has failed to
confirm the widely held popular belief.

MODEL_ANSWER:
(A): economic
(B): susceptibility
(C): severity
(D): debate

EXPLANATION:
""",
]


# ── CLI 진입점 ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="요약문 빈칸4개 문항 자동 검증 (메타프롬프트 v1.2)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        'files', nargs='*', metavar='FILE',
        help="검증할 문항 텍스트 파일. '-'를 지정하면 stdin에서 읽음.",
    )
    parser.add_argument('--demo', action='store_true', help="내장 샘플 5문항 검증 실행")
    parser.add_argument('--verbose', '-v', action='store_true', help="PASS 항목도 상세 출력")
    args = parser.parse_args()

    if not args.files and not args.demo:
        parser.print_help()
        sys.exit(0)

    total_errors = total_warnings = 0
    items: list[QuestionItem] = []

    if args.demo:
        print("\n[DEMO MODE] 이슈 문서 기반 5문항 자동 검증")
        print("각 문항에서 알려진 결함이 탐지되는지 확인합니다.\n")
        titles = ["Q1 (5과_2)", "Q2 (5과_3)", "Q3 (9-1)", "Q4 (9-2)", "Q5 (9-3)"]
        for raw, title in zip(DEMO_SAMPLES, titles):
            items.append(parse_question(raw, title=title))

    for path in args.files:
        if path == '-':
            raw = sys.stdin.read()
            title = "stdin"
        else:
            try:
                with open(path, encoding='utf-8') as f:
                    raw = f.read()
            except FileNotFoundError:
                print(f"[ERROR] 파일을 찾을 수 없음: {path}", file=sys.stderr)
                continue
            title = path
        items.append(parse_question(raw, title=title))

    for item in items:
        results = run_all_checks(item)
        errs, warns = report(item, results, verbose=args.verbose)
        total_errors += errs
        total_warnings += warns

    # 최종 요약
    print(f"\n{'─' * 64}")
    print(f"  총 {len(items)}문항 검증 완료")
    print(f"  ERROR: {total_errors}건  |  WARNING: {total_warnings}건")
    if total_errors == 0:
        print("  전체 PASS (ERROR 없음)")
    else:
        print(f"  {total_errors}건의 오류가 발견되었습니다. 위 내역을 확인하세요.")
    print(f"{'─' * 64}\n")

    sys.exit(1 if total_errors else 0)


if __name__ == '__main__':
    main()
