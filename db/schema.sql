DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Employee;


CREATE TABLE department (
    Department_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Department_Name VARCHAR(30) NOT NULL
);

CREATE TABLE Role (
    Role_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Role_Title VARCHAR(30) NOT NULL,
    Role_Salary DECIMAL NOT NULL,
    Department_ID INTEGER,
    CONSTRAINT FK_Department FOREIGN KEY (Department_ID) REFERENCES Department(Department_ID) ON DELETE CASCADE
);

CREATE TABLE Employee (
    Employee_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(30) NOT NULL,
    Last_Name VARCHAR(30) NOT NULL, 
    Role_ID INTEGER,
    Manager_ID INTEGER,
    CONSTRAINT FK_Role FOREIGN KEY (Role_ID) REFERENCES Role(Role_ID) ON DELETE CASCADE,
    CONSTRAINT FK_Manager FOREIGN KEY (Manager_ID) REFERENCES Employee(Employee_ID) ON DELETE SET NULL
);