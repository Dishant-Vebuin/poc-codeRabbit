DELETE t
FROM t_tasks t
INNER JOIN m_projects p
    ON t.project_id = p.id
WHERE t.id = :taskId
  AND p.owner_id = :ownerId;