const inquirer = require("inquirer");
const viewDepartments = require("./utils/queries");

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
