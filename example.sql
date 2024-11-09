DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Board (name) VALUES ('Board ' || i);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Roles (name) VALUES ('Role ' || i);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Users (name, surname, email, password, role)
        VALUES ('User', 'Name' || i, 'user' || i || '@example.com', 'password' || i, i % 5 + 1);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Keypoint (datetime, description, name)
        VALUES ('2023-10-01 09:00:00+00'::timestamp + make_interval(days => i),
                'Keypoint ' || i || ' description', 'Keypoint ' || i);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Task (name, board_id, description, duration, started, deadline, priority, repeat_period, keypoint_id)
        VALUES ('Task ' || i, i % 100 + 1, 'Description for Task ' || i, i * 10,
                '2023-10-01 09:00:00+00'::timestamp + make_interval(days => i),
                '2023-10-10 09:00:00+00'::timestamp + make_interval(days => i),
                i % 5 + 1, '1 day', i % 100 + 1);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO TimeInterval (task_id, user_id, begin_time, end_time, duration)
        VALUES (i % 100 + 1, i % 100 + 1,
                '2023-10-01 09:00:00+00'::timestamp + make_interval(days => i),
                '2023-10-01 10:00:00+00'::timestamp + make_interval(days => i),
                60);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Place (address)
        VALUES ('Address ' || i || ', City ' || i);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Meeting (name, description, duration, started, place_id, repeat_period, timeinterval_id, keypoint_id)
        VALUES ('Meeting ' || i, 'Description for Meeting ' || i, i * 10,
                '2023-10-01 09:00:00+00'::timestamp + make_interval(days => i),
                i % 100 + 1, '1 day', i % 100 + 1, i % 100 + 1);
    END LOOP;
END $$;

DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO MeetingMembers (meet_id, task_id, user_id)
        VALUES (i % 100 + 1, i % 100 + 1, i % 100 + 1);
    END LOOP;
END $$;
