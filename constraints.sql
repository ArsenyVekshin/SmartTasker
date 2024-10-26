ALTER TABLE TimeInterval
ADD CONSTRAINT check_interval_dates CHECK (begin_time < end_time);

ALTER TABLE Task
ADD CONSTRAINT check_task_dates CHECK (started < deadline);