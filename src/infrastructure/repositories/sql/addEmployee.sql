INSERT INTO
    m_employees (name, email, position, salary, deptId, created_by, updated_by)
VALUES
    (:name, :email, :position, :salary, :departmentId, :email, :email)
ON DUPLICATE KEY UPDATE email = email;