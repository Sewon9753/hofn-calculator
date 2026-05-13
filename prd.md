[PRD] 호픈(Hofn) 올인원 계산기
버전: 1.0
상태: 초안 완료 (Draft)
환경: 로컬 웹 브라우저 (Chrome 최적화)

1. 프로젝트 개요 (Project Overview)
* 서비스 이름: 호픈(Hopen) 올인원 계산기
* 한 줄 설명: 환율·단위 변환부터 대출·세금 계산까지, 외부 데이터 유출 없이 내 브라우저에서 완결되는 재테크 특화 계산 도구.
* 유형: 로컬 기반 웹 애플리케이션 (Local-first Web App)
* 핵심 타겟: 자산 관리 효율성과 데이터 보안을 중시하는 재테크족
* 개발 난이도: 중 (정확한 금융 로직 구현 및 로컬 스토리지 설계 필요)

2. 사용자 시나리오 (User Scenarios)
페르소나	상황 (When)	목적 (Why)
적극적 투자자	새로운 예적금 상품이나 대출을 비교할 때	세후 실이자와 월 상환액을 정확히 계산하여 가계부 반영
사회초년생	첫 연봉 계약을 하거나 실소득을 파악할 때	4대 보험과 소득세를 제외한 실제 내 통장에 찍힐 금액 확인
금융 관리자	예금 만기일이나 청약 일정을 관리할 때	D-Day 기능을 통해 중요한 금융 스케줄을 놓치지 않기 위함
보안 중시 사용자	민감한 자산 정보를 계산할 때	서버 전송 없이 로컬에서만 계산되는 도구로 개인정보 보호
3. 핵심 기능 목록 (Core Features)
3.1 필수 기능 (Must Have)
* 금융 계산기: 예/적금(단리, 복리), 대출 이자(원리금균등, 원금균등, 만기일시), 투자 수익률(수수료 포함).
* 세금 계산기: 연봉 실수령액(2026 요율 적용), 부가세(별도/포함), 취득세 기본 계산.
* 디데이(D-Day): 금융 상품 만기일, 청약일 등 관리 및 브라우저 로컬 저장.
* 생활/단위 변환: 일반 사칙연산, 길이/넓이/무게/부피 변환, 단가 비교 계산.
* 클립보드 복사: 모든 계산 결과값 옆에 원클릭 복사 버튼 제공.
* 로컬 데이터 관리: 모든 데이터는 브라우저 IndexedDB에 저장 (Zero-server).
3.2 선택 기능 (Nice to Have)
* 계산 기록 내보내기: 누적된 히스토리를 CSV 또는 Excel 파일로 로컬 다운로드.
* 즐겨찾기: 자주 사용하는 계산기 항목을 메인 상단에 배치.
* 커스텀 요율 설정: 세법 개정 시 사용자가 직접 소득세/보험 요율 수정 가능.

4. 기술 스택 (Tech Stack)
* Framework: React (Vite)
* UI Library: shadcn/ui (Radix UI 기반)
* Styling: Tailwind CSS
* State & Storage: Zustand (상태 관리) + Dexie.js (IndexedDB)
* Utility: * date-fns (날짜 계산)
    * xlsx (엑셀 파일 생성)
    * lucide-react (아이콘)

5. 화면 구성 (Screen Composition)
1. Dashboard (Main):
    * 주요 금융 D-Day 슬라이더.
    * 카테고리별 계산기 진입 카드 (shadcn Card 컴포넌트).
2. Calculator View:
    * 좌측: 상세 파라미터 입력부 (Input, Select, Slider).
    * 우측: 결과 요약 박스 (큰 폰트, 클립보드 복사 버튼).
3. History & Export:
    * 최근 계산 기록 테이블 (shadcn Table).
    * 전체 기록 삭제 및 엑셀 다운로드 버튼.
4. Settings:
    * 다크 모드 토글, 세금 요율 수동 설정.

6. 상세 기능 명세 (Logic Specs)
6.1 금융 수식
* 복리: $A = P(1 + r/n)^{nt}$
* 대출 원리금: $M = P \frac{r(1+r)^n}{(1+r)^n - 1}$
* 수수료 반영 수익률: ((매도가 * 수량 - 수수료) - (매수가 * 수량 + 수수료)) / (매수가 * 수량 + 수수료) * 100
6.2 데이터 연동
* Local Storage: Dexie.js를 통해 브라우저 종료 후에도 D-Day와 히스토리 유지.
* Export: xlsx 라이브러리를 사용해 브라우저 단에서 직접 파일 바이너리 생성 및 저장.

7. 디자인 가이드 (Design Guide)
* Color: * Primary: Slate-900 (신뢰감)
    * Accent: Emerald-600 (수익/성장)
    * Destructive: Rose-600 (지출/삭제)
* Font: Pretendard (본문), JetBrains Mono (숫자 가독성 강조)
* UI Pattern: shadcn/ui의 Clean & Minimal 스타일 준수.

8. 제약사항 및 고려사항 (Constraints)
* 데이터 보존: 브라우저 캐시 삭제 시 데이터가 소실되므로 사용자의 주기적인 엑셀 백업 권장 문구 노출.
* 오프라인 실행: 로컬 index.html 실행 시 모든 에셋(JS, CSS)이 정상 로드되도록 빌드 설정(In-line 에셋 등) 고려.
* 환율: CORS 이슈 방지를 위해 로컬 프록시 혹은 수동 업데이트 UI 제공 필요.

작성일: 2024-05-22
