-- mission_type 추가
INSERT INTO mission_types (id, type) VALUES (1, 'STATIC');
INSERT INTO mission_types (id, type) VALUES (2, 'DYNAMIC');


INSERT INTO missions (content, mission_type_id, mission_execution_type, required_object_label, mission_title)
VALUES 
('30분 이상 산책하세요.', 2, 'WALK', NULL, '산책 미션'),
('카페에서 컵 사진을 찍으세요.', 2, 'IMAGE', 'cup', '카페 컵 사진'),
('공원에서 걸어봐요.', 2, 'IMAGE', 'bench', '공원 벤치 사진'),
('길에서 예쁜 꽃을 찾아 사진을 찍으세요.', 2, 'IMAGE', 'flower', '꽃 사진 미션'),
('초록색 나뭇잎을 찾아 사진을 찍어보세요.', 2, 'IMAGE', 'leaves', '나뭇잎 사진 미션'),
('좋아하는 음악을 감상하고 기록하세요.', 1, 'MUSIC', NULL, '음악 감상'),
('오늘 하루를 돌아보며 짜증났던 일을 작성하세요.', 1, 'TEXT', NULL, '감정 돌봄');

-- user_mission 넣기 
INSERT INTO user_missions (date, is_completed, user_id, mission_id) VALUES
('2025-05-20', FALSE, 2, 1),
('2025-05-20', FALSE, 2, 2),
('2025-05-20', FALSE, 2, 4),
('2025-05-20', FALSE, 2, 6),
('2025-05-20', FALSE, 2, 7);