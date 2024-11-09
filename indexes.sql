CREATE INDEX idx_board_name ON Board (name);

CREATE INDEX idx_roles_name ON Roles (name);

CREATE INDEX idx_users_email ON Users (email);
CREATE INDEX idx_users_role ON Users (role);

CREATE INDEX idx_task_board_id ON Task (board_id);
CREATE INDEX idx_task_started ON Task (started);
CREATE INDEX idx_task_deadline ON Task (deadline);
CREATE INDEX idx_task_priority ON Task (priority);

CREATE INDEX idx_timeinterval_task_id ON TimeInterval (task_id);
CREATE INDEX idx_timeinterval_user_id ON TimeInterval (user_id);
CREATE INDEX idx_timeinterval_begin_time ON TimeInterval (begin_time);
CREATE INDEX idx_timeinterval_end_time ON TimeInterval (end_time);

CREATE INDEX idx_notifications_user_id ON Notifications (user_id);
CREATE INDEX idx_notifications_task_id ON Notifications (task_id);
CREATE INDEX idx_notifications_checked ON Notifications (checked);

CREATE INDEX idx_keypoint_datetime ON Keypoint (datetime);
CREATE INDEX idx_keypoint_name ON Keypoint (name);

CREATE INDEX idx_checklist_task_id ON Checklist (task_id);
CREATE INDEX idx_checklist_keypoint_id ON Checklist (keypoint_id);
CREATE INDEX idx_checklist_checked ON Checklist (checked);

CREATE INDEX idx_place_address ON Place (address);

CREATE INDEX idx_meeting_place_id ON Meeting (place_id);
CREATE INDEX idx_meeting_timeinterval_id ON Meeting (timeinterval_id);
CREATE INDEX idx_meeting_started ON Meeting (started);

CREATE INDEX idx_meetingmembers_meet_id ON MeetingMembers (meet_id);
CREATE INDEX idx_meetingmembers_task_id ON MeetingMembers (task_id);
CREATE INDEX idx_meetingmembers_user_id ON MeetingMembers (user_id);
