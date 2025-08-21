-- Password for both users is 'admin123'
INSERT INTO staff (username, password, name, role, department, staff_id) VALUES
 ('admin', '{bcrypt}$2a$10$8dXJ0f5tQO1B3oR7YVzXeOe9nN1rXvY2uZ3wX4p5q6r7s8t9u0v1w2', 'Admin User', 'ADMIN', 'IT Department', 'UB001'),
 ('user', '{bcrypt}$2a$10$8dXJ0f5tQO1B3oR7YVzXeOe9nN1rXvY2uZ3wX4p5q6r7s8t9u0v1w2', 'Regular User', 'USER', 'Finance Department', 'UB002');
