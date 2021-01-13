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

module.exports = { viewDepartments, viewRoles };