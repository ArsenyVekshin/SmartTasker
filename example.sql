-- Вставка тестовых данных в таблицы

-- Вставка тестовых данных в Board
INSERT INTO Board (name) VALUES 
('Project A'),
('Project B');

-- Вставка тестовых данных в Users
INSERT INTO Users (name, surname, email, password, role) VALUES
('Alice', 'Smith', 'alice@example.com', 'password1', 'Admin'),
('Bob', 'Brown', 'bob@example.com', 'password2', 'User'),
('Charlie', 'Davis', 'charlie@example.com', 'password3', 'User');

-- Вставка данных в Board_subscribers
INSERT INTO Board_subscribers (board_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- Вставка данных в Task
INSERT INTO Task (name, board_id, description, duration, started, deadline, priority, repeat_period) VALUES
('Design Database', 1, 'Design the initial database schema.', 120, '2024-10-25 10:00', '2024-10-26 18:00', 1, 'DAILY'),
('Implement Backend', 1, 'Set up backend APIs.', 180, '2024-10-26 09:00', '2024-10-30 17:00', 2, 'WEEKLY'),
('Write Documentation', 2, 'Create the project documentation.', 60, '2024-10-26 12:00', '2024-10-27 15:00', 3, 'MONTHLY');

-- Вставка данных в Board_s_task
INSERT INTO Board_s_task (task_id, board_id) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Вставка данных в TimeInterval
INSERT INTO TimeInterval (task_id, user_id, begin_time, end_time, duration) VALUES
(1, 1, '2024-10-25 10:00', '2024-10-25 12:00', 120),
(2, 2, '2024-10-26 09:00', '2024-10-26 12:00', 180);

-- Вставка данных в Notifications
INSERT INTO Notifications (user_id, message, checked) VALUES
(1, 'New task "Design Database" added.', FALSE),
(2, 'Deadline for task "Implement Backend" is approaching.', FALSE);

-- Вставка данных в Checklist
INSERT INTO Checklist (name, task_id) VALUES
('Setup Checklist', 1),
('Development Checklist', 2);

-- Вставка данных в Checklist_task
INSERT INTO Checklist_task (name, status) VALUES
('Create Database Schema', FALSE),
('Set up Backend Server', FALSE);

-- Вставка данных в Checklist2task
INSERT INTO Checklist2task (checklist_id, checklist_task_id) VALUES
(1, 1),
(2, 2);

-- Вставка данных в Board
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Board (name)
        VALUES ('Project ' || i);
    END LOOP;
END $$;

-- Вставка данных в Users
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Users (name, surname, email, password, role)
        VALUES (
            'User' || i,
            'Surname' || i,
            'user' || i || '@example.com',
            'password' || i,
            CASE WHEN i % 2 = 0 THEN 'Admin' ELSE 'User' END
        );
    END LOOP;
END $$;

-- Вставка данных в Board_subscribers
DO $$
DECLARE
    board_id INT;
    user_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайные ID для подписчика и доски
        board_id := (SELECT ID FROM Board ORDER BY RANDOM() LIMIT 1);
        user_id := (SELECT ID FROM Users ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Board_subscribers (board_id, user_id)
        VALUES (board_id, user_id)
        ON CONFLICT DO NOTHING; -- Избегаем дублирования подписок
    END LOOP;
END $$;

-- Вставка данных в Task
DO $$
DECLARE
    board_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайный board_id
        board_id := (SELECT ID FROM Board ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Task (name, board_id, description, duration, started, deadline, priority, repeat_period)
        VALUES (
            'Task ' || i,
            board_id,
            'Description of task ' || i,
            (RANDOM() * 180)::INT, -- Длительность от 0 до 180 минут
            NOW() - INTERVAL '1 day' * (RANDOM() * 10)::INT, -- Случайная дата начала
            NOW() + INTERVAL '1 day' * (RANDOM() * 10)::INT, -- Случайный дедлайн
            (RANDOM() * 5)::INT + 1, -- Приоритет от 1 до 5
            CASE WHEN i % 4 = 0 THEN 'DAILY'
                 WHEN i % 4 = 1 THEN 'WEEKLY'
                 WHEN i % 4 = 2 THEN 'MONTHLY'
                 ELSE 'YEARLY' END
        );
    END LOOP;
END $$;

-- Вставка данных в Board_s_task
DO $$
DECLARE
    board_id INT;
    task_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайные ID для task и board
        board_id := (SELECT ID FROM Board ORDER BY RANDOM() LIMIT 1);
        task_id := (SELECT ID FROM Task ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Board_s_task (task_id, board_id)
        VALUES (task_id, board_id)
        ON CONFLICT DO NOTHING; -- Избегаем дублирования задач на доске
    END LOOP;
END $$;

-- Вставка данных в TimeInterval
DO $$
DECLARE
    task_id INT;
    user_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайные task_id и user_id
        task_id := (SELECT ID FROM Task ORDER BY RANDOM() LIMIT 1);
        user_id := (SELECT ID FROM Users ORDER BY RANDOM() LIMIT 1);

        INSERT INTO TimeInterval (task_id, user_id, begin_time, end_time, duration)
        VALUES (
            task_id,
            user_id,
            NOW() - INTERVAL '1 hour' * (RANDOM() * 10)::INT,
            NOW() + INTERVAL '1 hour' * (RANDOM() * 10)::INT,
            (RANDOM() * 180)::INT -- Длительность от 0 до 180 минут
        );
    END LOOP;
END $$;

-- Вставка данных в Notifications
DO $$
DECLARE
    user_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайный user_id
        user_id := (SELECT ID FROM Users ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Notifications (user_id, message, checked)
        VALUES (
            user_id,
            'Notification message ' || i,
            CASE WHEN i % 2 = 0 THEN TRUE ELSE FALSE END
        );
    END LOOP;
END $$;

-- Вставка данных в Checklist
DO $$
DECLARE
    task_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайный task_id
        task_id := (SELECT ID FROM Task ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Checklist (name, task_id)
        VALUES (
            'Checklist ' || i,
            task_id
        );
    END LOOP;
END $$;

-- Вставка данных в Checklist_task
DO $$
BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO Checklist_task (name, status)
        VALUES (
            'Checklist Task ' || i,
            CASE WHEN i % 2 = 0 THEN TRUE ELSE FALSE END
        );
    END LOOP;
END $$;

-- Вставка данных в Checklist2task
DO $$
DECLARE
    checklist_id INT;
    checklist_task_id INT;
BEGIN
    FOR i IN 1..100 LOOP
        -- Выбираем случайные ID для checklist и checklist_task
        checklist_id := (SELECT ID FROM Checklist ORDER BY RANDOM() LIMIT 1);
        checklist_task_id := (SELECT ID FROM Checklist_task ORDER BY RANDOM() LIMIT 1);

        INSERT INTO Checklist2task (checklist_id, checklist_task_id)
        VALUES (checklist_id, checklist_task_id)
        ON CONFLICT DO NOTHING; -- Избегаем дублиров
