CREATE OR REPLACE FUNCTION create_notification_for_new_task() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO Notifications (user_id, message, checked)
  SELECT user_id, 'Новая задача "' || NEW.name || '" добавлена на доску.', FALSE
  FROM Board_subscribers
  WHERE board_id = NEW.board_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER notify_on_new_task
AFTER INSERT ON Task
FOR EACH ROW
EXECUTE FUNCTION create_notification_for_new_task();

CREATE OR REPLACE FUNCTION update_interval_duration()
RETURNS TRIGGER AS $$
BEGIN
  NEW.duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.begin_time)) / 60;  -- Duration в минутах
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_duration_on_interval
BEFORE INSERT OR UPDATE ON TimeInterval
FOR EACH ROW
EXECUTE FUNCTION update_interval_duration();

CREATE OR REPLACE FUNCTION create_empty_checklist()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM Checklist WHERE task_id = NEW.ID) THEN
    INSERT INTO Checklist (name, task_id) VALUES ('Default Checklist', NEW.ID);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER add_empty_checklist_on_task_creation
AFTER INSERT ON Task
FOR EACH ROW
EXECUTE FUNCTION create_empty_checklist();

CREATE OR REPLACE FUNCTION delete_checklist_tasks()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM Checklist_task
  WHERE ID IN (SELECT checklist_task_id FROM Checklist2task WHERE checklist_id = OLD.ID);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER cascade_delete_checklist_tasks
AFTER DELETE ON Checklist
FOR EACH ROW
EXECUTE FUNCTION delete_checklist_tasks();

ALTER TABLE Task
ADD CONSTRAINT unique_task_name_per_board UNIQUE (name, board_id);