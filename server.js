const inquirer = require("inquirer");
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require("./utils/queries");

promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Please select an option.',
            name: 'action',
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'Delete Employee']
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

            if (choice.action === "Delete Employee") {
                updateEmployeeManager();
            }
        });
};
