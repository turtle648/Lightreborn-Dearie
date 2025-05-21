update missions
set content = '15분 산책하세요.'
where mission_title = '산책 미션';

UPDATE missions
SET
    content = '산책하며 꽃, 나뭇잎, 벤치와 같은 주변경치를 찍어봐요!',
    mission_title = '산책 하기'
WHERE id = 5;