const inquirer = require("inquirer");
const { parse } = require("path/posix");
const Connection = require("../db/connection");
const displayData = require("./query");

function Questions() {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'allQuestions',
            message: 'What would you like to do?',
            choices: ['View all Departments', 'View all Employees', 'View all Roles', 'Add Department', 'Add Employee', 'Add Role', 'Update Employee Role']
        }
    ])
        .then(({ allQuestions }) => {
            if (allQuestions == 'View all Departments') {
                AllDepartment();
            } else if (allQuestions == 'View all Employees') {
                AllEmployees();
            } else if (allQuestions == 'View all Roles') {
                AllRoles();
            } else if (allQuestions == 'Add Department') {
                addDepartment();
            } else if (allQuestions == 'Add Role') {
                addRole();
            } else if (allQuestions == 'Add Employee') {
                addEmployee();
            } else if (allQuestions == 'Update Employee Role') {
                updateEmployee();
            }
        })

};


function AllDepartment() {
    const sql = `SELECT * FROM department`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        Questions();
    })
};

function AllEmployees() {
    const sql = `SELECT
    Employee.Employee_ID,
    Employee.First_Name,
    Employee.Last_Name,
    Role.Role_Title AS Role_Title,
    Role.Role_Salary AS Role_Salary,
    CONCAT (Manager.First_Name, " ", Manager.Last_Name) AS Manager
    FROM Employee
    LEFT JOIN role ON Employee.Role_ID = Role.Role_ID
    LEFT JOIN Department ON Role.Department_ID = Department.Department_ID
    LEFT JOIN Employee Manager ON Employee.Manager_ID = Manager.Employee_ID`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        allQuestions();
    })
};

function AllRoles() {
    const sql = `SELECT 
    Role_ID,
    Role_Title, 
    Department.Department_Name AS Department_Name,
    Role_Salary
    FROM Role
    LEFT JOIN Department
    ON role.Department_ID = Department.Department_ID`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
        allQuestions();
    })
    // allQuestions();
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What will be the new departments name?',
            validate: addDepartmentInput => {
                if (addDepartmentInput) {
                    return true;
                } else {
                    console.log('Make sure to give the department a name.');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO Department (Department_Name) VALUES(?)`;
        Connection.query(sql, userAnswer.addDepartment, (err, rows) => {
            if (err) throw err;
            console.log('new department added:)');
            Questions();
        });
    });
};

function addRole() {
    displayData(`SELECT * FROM Department`);
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What will be the new roles name?',
            validate: addRoleInput => {
                if (addRoleInput) {
                    return true;
                } else {
                    console.log('make sure to give a role name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleSalary',
            message: 'How much will the salary be?',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Make sure to give a salary to the new role.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleDepartment',
            message: 'Select a department from the ones above.',
            validate: addRoleDepartmentInput => {
                if (addRoleDepartmentInput) {
                    return true;
                } else {
                    console.log('Make sur eto give a department for the role.');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO Role (Role_Title, Role_Salary, Department_ID ) VALUES(?,?,?)`;
        Connection.query(sql, [userAnswer.addRole, parseInt(userAnswer.addRoleSalary), parseInt(userAnswer.addRoleDepartment)], (err, rows) => {
            if (err) throw err;
            console.log('Your role was added:)');
            Questions();
        });
    });
};

function addEmployee() {
    const sql = `SELECT 
    Role_ID,
    Role_Title, 
    Department.Department_Name AS Department,
    Role_Salary
    FROM Role
    LEFT JOIN Department
    ON Role.Department_ID = Department.Department_ID`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'addEmployeeName',
            message: 'What is the new employees first name?',
            validate: addRoleInput => {
                if (addRoleInput) {
                    return true;
                } else {
                    console.log('Please provide a first name for the new employee.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addEmployeeLast',
            message: 'What is the new employees last name?',
            validate: addRoleInput => {
                if (addRoleInput) {
                    return true;
                } else {
                    console.log('Please provide last name for the new employee.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addEmployeeTitle',
            message: 'What is the id number of the role of the new employee?',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please provide an ID for this role.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addRoleDepartment',
            message: 'What is your employees manager id?',
            validate: addRoleDepartmentInput => {
                if (addRoleDepartmentInput) {
                    return true;
                } else {
                    console.log('Please give a manager for this employee!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `INSERT INTO Employee ( First_Name, Last_Name, Role_ID, Manager_ID ) VALUES(?,?,?,?)`;
        Connection.query(sql, [userAnswer.addEmployeeName, userAnswer.addEmployeeLast, parseInt(userAnswer.addEmployeeTitle), parseInt(userAnswer.addRoleDepartment)], (err, rows) => {
            if (err) throw err;
            console.log('Your employee was added:)');
            Questions();
        });
    });
};

function updateEmployee() {
    const sql = `SELECT
    Employee.Employee_ID,
    Employee.First_Name,
    Employee.Last_Name,
    Role.Role_Title AS Role_Title,
    Role.Salary AS Role_Salary,
    CONCAT (Manager.First_Name, " ", Manager.Last_Name) AS Manager
    FROM Employee
    LEFT JOIN Role ON Employee.Role_ID = Role.Role_ID
    LEFT JOIN Department ON Role.Department_ID = Department.Department_ID
    LEFT JOIN Employee Manager ON Employee.Manager_ID = Manager.Employee_ID`;
    Connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    const sql2 = `SELECT 
    Role_ID,
    Role_Title, 
    Department.Department_Name AS Department,
    Role_Salary
    FROM Role
    LEFT JOIN Department
    ON Role.Department_ID = Department.Department_ID`;
    Connection.query(sql2, (err, rows) => {
        if (err)
            throw err;
        console.table(rows);
    })
    inquirer.prompt([
        {
            type: 'input',
            name: 'updateEmployeeID',
            message: 'Which employee ID would you like to update?',
            validate: addRoleInput => {
                if (addRoleInput) {
                    return true;
                } else {
                    console.log('Please give a response!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'updateEmployeeRole',
            message: 'Update the selected employee role',
            validate: addRoleSalaryInput => {
                if (addRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please give a response!');
                    return false;
                }
            }
        }
    ]).then(userAnswer => {
        const sql = `UPDATE Employee SET Employee_ID = ? WHERE Role_ID = ?`;
        Connection.query(sql, [parseInt(userAnswer.updateEmployeeID), parseInt(userAnswer.updateEmployeeRole)], (err, rows) => {
            if (err) throw err;
            console.log('Your employee was updated:)');
            Questions();
        });
    });
};



module.exports = Questions;