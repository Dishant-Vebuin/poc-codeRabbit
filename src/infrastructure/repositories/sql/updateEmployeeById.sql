UPDATE m_employees
SET
    name = COALESCE(:name, name),
    email = COALESCE(:email, email),
    position = COALESCE(:position, position),
    salary = COALESCE(:salary, salary),
    updated_at = NOW()
WHERE id = :employeeId;
