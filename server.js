const inquirer = require("inquirer");
const cTable = require('console.table');
// get the client
const mysql = require('mysql2');

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


promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Please select an option.',
            name: 'action',
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ])
        .then(choice => {

            if (choice.action === 'View Departments') {
                viewDepartments();
            }

            if (choice.action === 'View Roles') {
                viewRoles();
            }

            if (choice.action === 'View Employees') {
                viewEmployees();
            }

            if (choice.action === 'Add Department') {
                addDepartment();
            }

            if (choice.action === 'Add Role') {
                addRole();
            }

            if (choice.action === 'Add Employee') {
                addEmployee();
            }

            if (choice.action === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choice.action === "Update Employee Manager") {
                updateEmployeeManager();
            }
        });
};
