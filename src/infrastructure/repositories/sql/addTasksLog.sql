INSERT INTO t_tasks_audit (task_id, status, logged_at, logged_by)
VALUES (:taskId, :status, NOW(), :loggedBy);
