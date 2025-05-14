INSERT INTO "public"."survey_templates" ("id", "survey_title") VALUES
(1, '은둔/고립청년 자가 척도 설문');


INSERT INTO "public"."survey_questions" ("id", "content", "survey_type", "question_code", "survey_templates_id") VALUES
(1, '나는 지난 1주일 간 경제(소비/생산)활동이 전혀 없었고 1개월 이내에 구직활동 및 학업활동을 하지 않았다.', 'OBJECTIVE', '가', 1),
(2, '나의 생활패턴에 가장 가까운 생활을 선택해주세요', 'OBJECTIVE', '나', 1),
(3, '나는 사람과 거리를 둔다.', 'OBJECTIVE', '다', 1),
(4, '하루종일 집에서 보낸다', 'OBJECTIVE', '라', 1),
(5, '모르는 사람과 만나는 것을 아주 좋아한다.','OBJECTIVE', '마', 1),
(6, '누군가와 함께 하는 것을 불편하게 느낀다.','OBJECTIVE', '바', 1),
(7, '사람이 귀찮다.','OBJECTIVE', '사', 1),
(8, '하루종일 혼자서 지낸다.', 'OBJECTIVE','아', 1),
(9, '사람들에게 보여지는 것이 싫다.','OBJECTIVE', '자', 1),
(10, '집단에 들어가는 것이 서투르다.','OBJECTIVE', '차', 1),
(11, '사람들과 교류하는 일이 거의 없다.', 'OBJECTIVE','카', 1),
(12, '현재 주요 고민 내용을 입력해주세요.', 'SUBJECTIVE', '타', 1),
(13, '청년이음 사업을 알게 된 경로', 'SUBJECTIVE','', 1),
(14, '본인이 생각하는 은둔, 고립 시작 이유','SUBJECTIVE', '', 1),
(15, '은둔, 고립을 시작하게 된 날짜', 'SUBJECTIVE','', 1);