CREATE INDEX idx_board_id ON Task(board_id);
CREATE INDEX idx_task_id ON TimeInterval(task_id);
CREATE INDEX idx_user_id ON TimeInterval(user_id);

CREATE INDEX idx_user_id_bs ON Board_subscribers(user_id);