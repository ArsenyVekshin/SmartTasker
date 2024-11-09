DROP TABLE IF EXISTS Board, Users, Task, TimeInterval, Notifications, Checklist, Keypoint, Meeting, MeetingMembers, Roles, Place;
CREATE TABLE Board (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Roles (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    surname varchar(255),
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    role INT,
    FOREIGN KEY(role) REFERENCES Roles(ID)
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
    repeat_period INTERVAL,
    FOREIGN KEY (board_id) REFERENCES Board(ID) ON DELETE SET NULL
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
    task_id INT,
    message TEXT,
    checked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES Task(ID) ON DELETE CASCADE
);

CREATE TABLE Keypoint (
    ID SERIAL PRIMARY KEY,
    datetime TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE Checklist (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    task_id INT NOT NULL,
    checked BOOLEAN DEFAULT FALSE NOT NULL,
    keypoint_id INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES Task(ID) ON DELETE CASCADE,
    FOREIGN KEY (keypoint_id) REFERENCES Keypoint(ID) ON DELETE CASCADE
);

CREATE TABLE Place (
    ID SERIAL PRIMARY KEY,
    address TEXT NOT NULL
);

CREATE TABLE Meeting (
    ID SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    duration INT NOT NULL,
    started TIMESTAMPTZ NOT NULL,
    place_id INT NOT NULL,
    repeat_period INTERVAL,
    timeinterval_id INT,
    FOREIGN KEY (place_id) REFERENCES Place(ID),
    FOREIGN KEY (timeinterval_id) REFERENCES TimeInterval(ID)
);

CREATE TABLE MeetingMembers (
    meet_id INT,
    task_id INT,
    user_id INT,
    PRIMARY KEY (meet_id, task_id, user_id),
    FOREIGN KEY (meet_id) REFERENCES Meeting(ID),
    FOREIGN KEY (task_id) REFERENCES Task(ID),
    FOREIGN KEY (user_id) REFERENCES Users(ID)
);
