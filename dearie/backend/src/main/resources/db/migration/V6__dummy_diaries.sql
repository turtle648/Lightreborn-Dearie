BEGIN;

-- 1번 일기: RETURNING을 사용하여 자동 생성된 ID 값을 얻습니다
DO $$
DECLARE
    diary_id1 INTEGER;
BEGIN
    -- 일기 삽입하고 생성된 ID 반환
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('오늘은 오랜만에 프로젝트를 끝내고 친구랑 엽떡을 먹으러 갔다. 정말 기대하고 있었는데, 실수로 음식을 바닥에 쏟아버렸다. 하루의 피로가 확 몰려오면서 너무 화가 났다. 기다렸던 보상이 이렇게 사라지니까 허탈하기도 하고 짜증이 밀려왔다.', 
            '2025-05-20', 
            '그 순간 정말 속상했겠어요. 기대했던 시간이 엉망이 되면 마음도 같이 무너지곤 하죠. 다음엔 더 따뜻하고 웃을 수 있는 일이 찾아오길 바랄게요. 오늘은 조용히 나를 위한 시간을 가져보는 것도 좋을 것 같아요 ☕️', 
            1, 
            false, 
            'ANGER')
    RETURNING id INTO diary_id1;
    
    -- 반환된 ID를 사용하여 관련 레코드 삽입
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EC%97%BD%EB%96%A1.jpg', diary_id1);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (1, 16, 100, 6, 37, diary_id1);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('분노', diary_id1);
END $$;

-- 2번 일기
DO $$
DECLARE
    diary_id2 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('가족들과 함께 유등축제를 다녀왔다. 하늘이 어두워지자 하나둘 불이 켜진 유등들이 강 위를 아름답게 수놓았고, 그 아래서 걷는 기분은 정말 환상적이었다. 사람들의 웃음소리, 맛있는 음식 냄새, 그리고 반짝이는 빛들이 어우러져 너무 행복한 저녁이다.', 
            '2025-05-20', 
            '가족과 함께한 반짝이는 밤, 상상만 해도 마음이 따뜻해져요. 그렇게 빛나는 기억은 오래도록 힘이 되어줄 거예요 ✨ 앞으로도 소중한 사람들과 예쁜 순간들을 많이 쌓아가길 바라요!', 
            1, 
            false, 
            'JOY')
    RETURNING id INTO diary_id2;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EC%9C%A0%EB%93%B1%EC%B6%95%EC%A0%9C.jpg', diary_id2);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (73, 18, 35, 40, 29, diary_id2);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('기쁨', diary_id2);
END $$;

-- 3번 일기
DO $$
DECLARE
    diary_id3 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('시내 중심에 있는 오래된 절을 친구들과 함께 찾았다. 입구를 지나자마자 고요한 분위기가 마음을 차분하게 만들어줬다. 향냄새가 은은하게 감돌았고, 종소리가 멀리서 들려오는 듯했다. 잠시 눈을 감고 기도하며 마음을 정리할 수 있는 소중한 시간이었다.', 
            '2025-05-20', 
            '고요한 절의 분위기와 향냄새 속에서 마음을 다잡을 수 있었던 하루였군요. 바쁘게 흘러가는 일상 속에서 이런 시간은 정말 소중하죠. 그 평온함이 오래도록 머물기를 기도할게요 🙏', 
            1, 
            false, 
            'NEUTRAL')
    RETURNING id INTO diary_id3;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EC%A0%88.jpg', diary_id3);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (36, 18, 2, 40, 98, diary_id3);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('평온', diary_id3);
END $$;

-- 4번 일기
DO $$
DECLARE
    diary_id4 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('SNS에서 유명하다는 녹차라떼를 마셔보려고 일부러 시간을 내서 갔는데, 기대했던 만큼의 맛은 아니었다. 진하고 달콤할 줄 알았는데 밍밍하고 텁텁해서 실망감이 컸다. 좋아하는 걸 기대했다가 실망했을 때의 그 허무함이 꽤 오래 갔다.', 
            '2025-05-20', 
            '기대를 품고 간 만큼 아쉬움도 컸을 거예요. 그런 날은 누구에게나 있답니다. 오늘은 조금 실망했지만, 내일은 더 나은 하루가 되길 바라요. 햇살 아래 짧은 산책도 추천할게요 🌿', 
            1, 
            false, 
            'SADNESS')
    RETURNING id INTO diary_id4;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EB%85%B9%EC%B0%A8%EB%9D%BC%EB%96%BC.jpg', diary_id4);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (24, 63, 28, 9, 2, diary_id4);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('슬픔', diary_id4);
END $$;

-- 5번 일기
DO $$
DECLARE
    diary_id5 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('SNS에서 보자마자 반한 케이크가 있는 가게에 가기로 마음먹었다. 근데 이 가게가 워낙 인기가 많아서 내가 도착했을 땐 이미 매진일까 봐 걱정이 앞섰다. 마음속에선 혹시 못 사면 어쩌지? 하는 불안이 자꾸 올라왔다. 꼭 맛보고 싶다, 제발 하나만 남아 있기를!', 
            '2025-05-20', 
            '기대가 클수록 불안도 자라나곤 하죠. 기다리는 그 마음마저도 참 예뻐요. 꼭 원하는 케이크를 만날 수 있기를 진심으로 응원할게요 🎂 그 설렘이 좋은 기억으로 남길 바라요!', 
            1, 
            false, 
            'ANXIETY')
    RETURNING id INTO diary_id5;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EC%BC%80%EC%9D%B4%ED%81%AC.jpg', diary_id5);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (22, 0, 30, 86, 34, diary_id5);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('불안', diary_id5);
END $$;

-- 6번 일기
DO $$
DECLARE
    diary_id6 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('드디어, 내가 그렇게 기다리던 아이돌의 콘서트를 보러 갔다. 입장할 때부터 심장이 두근거렸고, 무대가 시작되자마자 눈물이 나올 뻔했다. 생생한 무대, 눈부신 조명, 팬들의 함성... 모든 순간이 꿈만 같았다. 오늘 하루는 평생 기억에 남을 것 같다.', 
            '2025-05-20', 
            '좋아하는 무대를 눈앞에서 만났을 때의 벅참, 얼마나 감동이었을까요! 그런 순간은 마음 깊은 곳에서 오래오래 빛나죠. 오늘 느낀 행복이 다음 날에도 이어지길 바랍니다 ✨', 
            1, 
            true, 
            'JOY')
    RETURNING id INTO diary_id6;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EC%BD%98%EC%84%9C%ED%8A%B8.jpg', diary_id6);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (83, 40, 22, 8, 1, diary_id6);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('기쁨', diary_id6);
END $$;

-- 7번 일기
DO $$
DECLARE
    diary_id7 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('우연히 예전 친구들과 함께 살았던 동네를 지나게 되었다. 익숙한 건물, 그때 자주 가던 가게들, 벤치... 모든 것이 그대로인데 우리는 각자의 길을 걷고 있다. 잠시 멈춰서 그 시절을 떠올리니 마음 한편이 허전해졌다. 문득, 친구들이 너무 그리웠다.', 
            '2025-05-20', 
            '추억이 깃든 장소는 마음을 조용히 흔들곤 하죠. 그리움은 우리가 누군가를 얼마나 소중히 여겼는지를 알려주는 감정이에요. 따뜻한 햇살 아래 천천히 걸으며 마음을 달래보는 건 어떨까요? ☀️', 
            1, 
            false, 
            'SADNESS')
    RETURNING id INTO diary_id7;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EA%B2%BD%EC%B9%98.jpg', diary_id7);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (5, 68, 25, 1, 9, diary_id7);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('슬픔', diary_id7);
END $$;

-- 8번 일기
DO $$
DECLARE
    diary_id8 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('SNS에서 보고 너무 마시고 싶었던 큐브라떼를 드디어 샀다. 예쁜 컵에 얼음 큐브가 들어가 있었고, 딱 한 입 마시려던 순간 누군가랑 부딪혀서 그만 바닥에 다 쏟고 말았다. 눈앞이 하얘지고 속에서 울컥 화가 치밀었다. 오늘 하루 기분이 다 망가진 느낌이었다.', 
            '2025-05-20', 
            '정말 아까웠겠다... 기대한 순간이 어이없이 무너지면 속상함이 오래 남죠. 그래도 당신의 하루가 이 일 하나로 정의되지 않기를 바라요. 다음엔 더 좋은 커피가 기다리고 있을 거예요 ☕️', 
            1, 
            false, 
            'ANGER')
    RETURNING id INTO diary_id8;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%ED%81%90%EB%B8%8C%EB%9D%BC%EB%96%BC.jpg', diary_id8);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (37, 35, 75, 19, 31, diary_id8);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('분노', diary_id8);
END $$;

-- 9번 일기
DO $$
DECLARE
    diary_id9 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('긴장과 스트레스로 가득했던 시험이 끝난 날. 내가 가장 좋아하는 피자를 시켜서 조용한 방에서 한 조각씩 천천히 먹었다. 아무 말도, 아무 생각도 하지 않고 그냥 피자와 함께 있는 시간이 너무 좋았다. 오늘만큼은 온전히 나만의 시간이었다.', 
            '2025-05-20', 
            '시험을 끝낸 후의 고요한 피자 타임이라니, 듣기만 해도 평화롭네요. 스스로를 위한 시간이 주는 위안은 참 소중하죠. 그 여유로움이 오랫동안 이어지기를 바랍니다 😊', 
            1, 
            true, 
            'NEUTRAL')
    RETURNING id INTO diary_id9;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%ED%94%BC%EC%9E%90.jpg', diary_id9);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (28, 36, 26, 37, 81, diary_id9);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('평온', diary_id9);
END $$;

-- 10번 일기
DO $$
DECLARE
    diary_id10 INTEGER;
BEGIN
    INSERT INTO diary (content, created_at, ai_comment, user_id, bookmarked, emotion_tag)
    VALUES ('평소와 다름없이 걷던 길에서 무심코 고개를 돌렸는데, 거기에 너무도 예쁜 꽃이 피어 있었다. 햇빛을 받아 반짝이는 모습이 눈을 뗄 수 없게 만들었다. 순간 카메라를 꺼내 사진을 찍고, 한참을 바라봤다. 자연이 주는 선물 같은 순간이었다.', 
            '2025-05-20', 
            '길가에 핀 꽃을 눈여겨보는 당신의 마음이 참 따뜻하네요. 그런 감성을 간직한 하루는 분명 더 풍요롭고 아름답게 기억될 거예요 🌸 오늘도 그런 예쁜 순간을 만날 수 있기를!', 
            1, 
            true, 
            'JOY')
    RETURNING id INTO diary_id10;
    
    INSERT INTO diary_image (image_url, diary_id)
    VALUES ('https://dearie-bucket.s3.ap-northeast-2.amazonaws.com/diary/dummy/%EA%BD%83.jpg', diary_id10);
    
    INSERT INTO emotion_score (joy, sadness, anger, anxiety, calm, diary_id)
    VALUES (70, 1, 14, 29, 22, diary_id10);
    
    INSERT INTO emotion_tag (tag, diary_id)
    VALUES ('기쁨', diary_id10);
END $$;

COMMIT;