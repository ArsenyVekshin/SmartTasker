-- Получение списка задач, назначенных на определенную доску, с указанием пользователей, которые их выполняют.
CREATE OR REPLACE FUNCTION get_board_tasks(board_id INT)
    RETURNS TABLE
            (
                task_id      INT,
                name         TEXT,
                description  TEXT,
                user_name    TEXT,
                user_surname TEXT,
                start_time   TIMESTAMPTZ,
                end_time     TIMESTAMPTZ
            )
AS
$$
BEGIN
    RETURN QUERY SELECT T.ID,
                        T.name,
                        T.description,
                        U.name        AS User_Name,
                        U.surname     AS User_Surname,
                        TI.begin_time AS Start_Time,
                        TI.end_time   AS End_Time
                 FROM Task AS T
                      JOIN Board AS B ON T.board_id = B.ID
                      LEFT JOIN TimeInterval AS TI ON T.ID = TI.task_id
                      LEFT JOIN Users AS U ON TI.user_id = U.ID
                 WHERE B.ID = board_id
                 ORDER BY T.ID;
END;
$$ LANGUAGE plpgsql;

-- Вывод списка задач, назначенных на определенного пользователя, с группировкой по приоритету.
CREATE OR REPLACE FUNCTION get_user_tasks_by_priority(user_id INT)
    RETURNS TABLE
            (
                priority   INT,
                task_count BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY SELECT T.priority,
                        COUNT(*) AS Task_Count
                 FROM Task AS T
                      JOIN TimeInterval AS TI ON T.ID = TI.task_id
                 WHERE TI.user_id = user_id
                 GROUP BY T.priority
                 ORDER BY T.priority;
END;
$$ LANGUAGE plpgsql;

-- Получение информации о встречах, которые были назначены на определенное место
CREATE OR REPLACE FUNCTION get_meetings_by_place(place_id INT)
    RETURNS TABLE
            (
                meeting_name TEXT,
                description  TEXT,
                started      TIMESTAMPTZ,
                duration     INT,
                address      TEXT
            )
AS
$$
BEGIN
    RETURN QUERY SELECT M.name,
                        M.description,
                        M.started,
                        M.duration,
                        P.address
                 FROM Meeting AS M
                      JOIN Place AS P ON M.place_id = P.ID
                 WHERE P.ID = place_id;
END;
$$ LANGUAGE plpgsql;
