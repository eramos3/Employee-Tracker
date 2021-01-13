const cTable = require('console.table');
// get the client
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
                message: 'Type in the department ID in which the role belongs to',
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
                message: 'Type in the salary for this role title',
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
module.exports = { viewDepartments, viewRoles, addDepartment,addRole };