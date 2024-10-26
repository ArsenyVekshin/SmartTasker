DROP TABLE IF EXISTS Board, Users, Board_subscribers, Task, Board_s_task,TimeInterval, Notifications,Checklist,Checklist2task,Checklist_task;
CREATE TABLE Board (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT
);

CREATE TABLE Board_subscribers (
    board_id INT,
    user_id INT,
    PRIMARY KEY (board_id, user_id),
    FOREIGN KEY (board_id) REFERENCES Board(ID) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Task (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    board_id INT,
    description TEXT,
    duration INT,
    started TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    priority INT,
    repeat_period TEXT CHECK (repeat_period IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
    FOREIGN KEY (board_id) REFERENCES Board(ID) ON DELETE SET NULL
);

CREATE TABLE Board_s_task (
    task_id INT,
    board_id INT,
    PRIMARY KEY (task_id, board_id),
    FOREIGN KEY (task_id) REFERENCES Task(ID) ON DELETE CASCADE,
    FOREIGN KEY (board_id) REFERENCES Board(ID) ON DELETE CASCADE
);

CREATE TABLE TimeInterval (
    ID SERIAL PRIMARY KEY,
    task_id INT,
    user_id INT,
    begin_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INT,
    FOREIGN KEY (task_id) REFERENCES Task(ID) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES Users(ID) ON DELETE SET NULL
);

CREATE TABLE Notifications (
    ID SERIAL PRIMARY KEY,
    user_id INT,
    message TEXT,
    checked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Checklist (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    task_id INT,
    FOREIGN KEY (task_id) REFERENCES Task(ID) ON DELETE CASCADE
);

CREATE TABLE Checklist_task (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN DEFAULT FALSE
);

CREATE TABLE Checklist2task (
    checklist_id INT,
    checklist_task_id INT,
    PRIMARY KEY (checklist_id, checklist_task_id),
    FOREIGN KEY (checklist_id) REFERENCES Checklist(ID) ON DELETE CASCADE,
    FOREIGN KEY (checklist_task_id) REFERENCES Checklist_task(ID) ON DELETE CASCADE
);
