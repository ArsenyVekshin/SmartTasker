CREATE OR REPLACE FUNCTION notify_new_task()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Notifications (user_id, task_id, message)
    SELECT id, NEW.id, 'New task created: ' || NEW.name
    FROM Users;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_task_notification
AFTER INSERT ON Task
FOR EACH ROW
EXECUTE FUNCTION notify_new_task();

CREATE OR REPLACE FUNCTION update_task_duration()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Task
    SET duration = (SELECT SUM(duration) FROM TimeInterval WHERE task_id = NEW.task_id)
    WHERE id = NEW.task_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_duration
AFTER INSERT OR UPDATE ON TimeInterval
FOR EACH ROW
EXECUTE FUNCTION update_task_duration();

CREATE OR REPLACE FUNCTION notify_new_meeting_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Notifications (user_id, task_id, message)
    VALUES (NEW.user_id, NEW.task_id, 'You have been added to a new meeting: ' || (SELECT name FROM Meeting WHERE id = NEW.meet_id));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_meeting_member_notification
AFTER INSERT ON MeetingMembers
FOR EACH ROW
EXECUTE FUNCTION notify_new_meeting_member();