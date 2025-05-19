-- 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS hangjungs (
    id BIGSERIAL PRIMARY KEY,           -- SERIAL → BIGSERIAL (Long 타입에 맞춤)
    hangjung_code VARCHAR(100) NOT NULL, -- INTEGER → VARCHAR (String 타입에 맞춤)
    hangjung_name VARCHAR(100) NOT NULL,
    
    -- 복합 인덱스 추가 (Entity에 정의된 대로)
    CONSTRAINT idx_hangjung_code_name UNIQUE (hangjung_code, hangjung_name)
);

-- 기존 데이터 삭제 및 ID 재설정
TRUNCATE TABLE hangjungs RESTART IDENTITY;

-- 데이터 삽입 (숫자 값을 문자열로 변경)
INSERT INTO hangjungs (hangjung_code, hangjung_name) VALUES
    ('48330250', '중앙동'), ('48330253', '양주동'), ('48330256', '삼성동'),
    ('48330259', '강서동'), ('48330262', '서창동'), ('48330265', '소주동'),
    ('48330268', '평산동'), ('48330271', '덕계동'), ('48330110', '물금읍'),
    ('48330120', '동면'), ('48330130', '원동면'), ('48330140', '상북면'),
    ('48330150', '하북면');