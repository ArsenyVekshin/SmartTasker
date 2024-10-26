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
