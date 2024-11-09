ALTER TABLE Users
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE MeetingMembers
ADD CONSTRAINT unique_meeting_members UNIQUE (meet_id, task_id, user_id);

ALTER TABLE Task
ADD CONSTRAINT positive_duration CHECK (duration > 0);

ALTER TABLE TimeInterval
ADD CONSTRAINT duration_positive CHECK (duration > 0);

ALTER TABLE Meeting
ADD CONSTRAINT duration_positive CHECK (duration > 0);
