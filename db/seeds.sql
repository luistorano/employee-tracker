INSERT INTO Department (Department_Name)
VALUES 
    ('Creator'),
    ('King Of Games'),
    ('Master Duelist'),
    ('Average Duelist');

    INSERT INTO Role (Department_ID, Department_Title, Salary)
    VALUES 
    (1, 'Creator Of Game', '50.00'),
    (2, 'King Of Cards', '35.00'),
    (3, 'Pro Duelist', '28.00'),
    (2, 'Casual Duelist', '20.00');

    INSERT INTO Employee (First_Name, Last_Name, Role_ID, Manager_ID)
    VALUES 
    ('Pegasus', 'Maximilian', 1, NULL),
    ('Yugi', 'Moto', 2, 1);
