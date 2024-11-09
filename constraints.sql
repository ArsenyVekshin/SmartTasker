ALTER TABLE Users
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE MeetingMembers
ADD CONSTRAINT unique_meeting_members UNIQUE (meet_id, task_id, user_id);
