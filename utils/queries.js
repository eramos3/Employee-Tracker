const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require("inquirer");

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '!Cheesydata1',
    database: 'company',
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    console.log('Welcome to Employee Tracker');
    promptUser();
});
// queries 
const viewDepartments = () => {
    console.log('-------------------');
    console.log('Showing Departments');
    console.log('-------------------');

    connection.query(
        'SELECT * FROM departments',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    );
};

const viewRoles = () => {
    console.log('------------');
    console.log('Showing Roles');
    console.log('------------');

    connection.query(
        'SELECT roles.id, role_title, department, salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    );
};

const viewEmployees = () => {
    console.log('-----------------');
    console.log('Showing Employees');
    console.log('-----------------');

    connection.query(
        `SELECT employees.id, employees.first_name, employees.last_name, role_title, department, salary,
        CONCAT(manager_alias.first_name, ' ', manager_alias.last_name) AS manager_name FROM roles
            RIGHT JOIN employees ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS manager_alias ON employees.manager_id = manager_alias.id`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    );
};
const addDepartment = () => {
    console.log('---------------------');
    console.log('Adding New Department');
    console.log('---------------------');

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Type in department name',
                validate: department => {
                    if (department) {
                        return true;
                    } else {
                        console.log("Enter department name");
                        return false;
                    }
                }
            }
        ])
        .then(nDepartment => {

            connection.query(
                'INSERT INTO departments SET ?', nDepartment,

                function (err, res) {
                    if (err) throw err;
                    console.log(`<----- New Department has been added as id = ${res.insertId} ----->`);
                    viewDepartments();
                }
            );
        })
};

const addRole = () => {
    console.log('---------------');
    console.log('Adding New Role');
    console.log('---------------');

    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'department_id',
                message: 'Type in corresponding department ID for role',
                validate: deptId => {
                    if (deptId) {
                        return true;
                    } else {
                        console.log("Enter department ID");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'role_title',
                message: 'Type in the role title',
                validate: role => {
                    if (role) {
                        return true;
                    } else {
                        console.log("Enter role title");
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Type in the salary for this role',
                validate: salary => {
                    if (salary) {
                        return true;
                    } else {
                        console.log("Please enter a salary");
                        return false;
                    }
                }
            }
        ])
        .then(newRole => {
            connection.query(
                'INSERT INTO roles SET ?', newRole,
                function (err, res) {
                    if (err) throw err;
                    console.log(`<----- New Role has been added as id = ${res.insertId} ----->`);
                    viewRoles();
                }
            );
        })
};

const addEmployee = () => {
    console.log('-------------------');
    console.log('Adding New Employee');
    console.log('-------------------');

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Enter employee's first name",
                validate: firstName => {
                    if (firstName) {
                        return true;
                    } else {
                        console.log("Enter the first name");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter employee's last name",
                validate: lastName => {
                    if (lastName) {
                        return true;
                    } else {
                        console.log("Enter the last name");
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'role_id',
                message: "Enter employee's ID role",
                validate: role => {
                    if (role) {
                        return true;
                    } else {
                        console.log("Enter employee's ID role");
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'manager_id',
                message: "Enter employee's manager's ID",
                validate: manager => {
                    if (manager) {
                        return true;
                    } else {
                        console.log("Enter manager ID number");
                        return false;
                    }
                }
            }
        ])

        .then(newEmployee => {

            const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
            const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id];

            connection.query(sql, params,

                function (err, res) {
                    if (err) throw err;
                    console.log(`<----- New Employee has been added as id = ${res.insertId} ----->`);
                    viewEmployees();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
        ;
};

const updateEmployeeRole = () => {
    console.log('----------------------');
    console.log('Updating Employee Role');
    console.log('----------------------');
    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'id',
                message: "Enter employee id",
                validate: id => {
                    if (id) {
                        return true;
                    } else {
                        console.log("Please enter employee id");
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'role_id',
                message: "Enter employee's new role id",
                validate: id => {
                    if (id) {
                        return true;
                    } else {
                        console.log("Please enter role id");
                        return false;
                    }
                }
            }
        ])
        .then(updateRole => {

            const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
            const params = [updateRole.role_id, updateRole.id];
            connection.query(sql, params,
                function (err, res) {
                    if (err) throw err;
                    console.log('<----- Employee Role has been updated ----->');
                    viewEmployees();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
};

const updateEmployeeManager = () => {
    console.log('-------------------------');
    console.log('Updating Employee Manager');
    console.log('-------------------------');
    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'id',
                message: "Enter employee id",
                validate: id => {
                    if (id) {
                        return true;
                    } else {
                        console.log("Please enter employee id");
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'manager_id',
                message: "Enter manager id",
                validate: id => {
                    if (id) {
                        return true;
                    } else {
                        console.log("Please enter manager id");
                        return false;
                    }
                }
            }
        ])
        .then(updateManager => {
            const sql = 'UPDATE employees SET manager_id = ? WHERE id = ?';
            const params = [updateManager.manager_id, updateManager.id];
            connection.query(sql, params,
                function (err, res) {
                    if (err) throw err;
                    console.log('<----- Employee manager has been updated ----->');
                    viewEmployees();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
}

const deleteDepartment = () => {
    console.log('-------------------');
    console.log('Deleting Department');
    console.log('-------------------');
    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'id',
                message: 'Type in corresponding department ID that you want to delete',
                validate: deptId => {
                    if (deptId) {
                        return true;
                    } else {
                        console.log("Enter department ID");
                        return false;
                    }
                }
            }
        ])
        .then(deleteDept => {
            const sql = 'DELETE FROM departments WHERE id = ?';
            const params = [deleteDept.id];
            connection.query(sql, params,
                function (err, res) {
                    if (err) throw err;
                    console.log('<----- Department has been deleted ----->');
                    viewDepartments();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
};

const deleteRole = () => {
    console.log('-------------');
    console.log('Deleting Role');
    console.log('-------------');
    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'id',
                message: 'Type in role ID that will be deleted',
                validate: roleId => {
                    if (roleId) {
                        return true;
                    } else {
                        console.log("Enter role ID");
                        return false;
                    }
                }
            },
        ])
        .then(deleteRole => {
            const sql = 'DELETE FROM roles WHERE id = ?';
            const params = [deleteRole.id];
            connection.query(sql, params,
                function (err, res) {
                    if (err) throw err;
                    console.log('<----- Role has been deleted ----->');
                    viewRoles();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
};

const deleteEmployee = () => {
    console.log('-----------------');
    console.log('Deleting Employee');
    console.log('-----------------');
    return inquirer
        .prompt([
            {
                type: 'number',
                name: 'id',
                message: 'Type in employee ID that will be deleted',
                validate: employeeId => {
                    if (employeeId) {
                        return true;
                    } else {
                        console.log("Enter employee ID");
                        return false;
                    }
                }
            },
        ])
        .then(deleteEmployee => {
            const sql = 'DELETE FROM employees WHERE id = ?';
            const params = [deleteEmployee.id];
            connection.query(sql, params,
                function (err, res) {
                    if (err) throw err;
                    console.log('<----- Employee has been deleted ----->');
                    viewEmployees();
                }
            )
        })
        .catch(err => {
            console.log(err);
        })
};

module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteDepartment, deleteRole, deleteEmployee };