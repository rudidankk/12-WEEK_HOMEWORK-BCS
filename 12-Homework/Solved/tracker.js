//Packages 
const inquirer = require("inquirer");
const mysql = require("mysql");
const questions = require("./questions");
const consoleTable = require('console.table');

//setting up the connection with the DB
const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "root",
    database: "homework12"
});

connection.connect(function (err) {
    if (err) throw err;

});


//initial function 
determineAction()
async function determineAction() {

    const results = await inquirer.prompt(questions.actions);
    switch (results.actions) {
        case 'Add new employee': 
            addEmployee();
            break;
        case 'View all employees': 
            viewAll();
            break;
        case 'Update employee role': 
            updateRole();
            break;
        case 'View all roles':
            viewAllRoles(); 
            break;
        case "Add role":
            addRole(); 
            break;
        case 'View all departments':
            viewAllDpt(); 
            break;
        case 'Add department':
            addDpt(); 
            break;

        default:
            connection.end();
            break;

    }
}

function addEmployee() {

    connection.query("SELECT * FROM employee", function (err, employees ) {
        connection.query("SELECT * FROM role", function (err, roles) {
            if (err) throw err;

            inquirer.prompt([

                {
                    type: "input",
                    name: "firstname",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "lastname",
                    message: "What is the employee's last name?"
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < roles.length; i++) {
                            choiceArray.push(roles[i].title);
                        }

                        return choiceArray;
                    },
                    message: "What is the employee's role?"
                },

                {
                    name: "manager",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            arrayOfChoices.push(employees[i].first_name);
                        }

                        return arrayOfChoices;
                    },
                    message: "Who is the employee's manager?"
                }

            ]).then(function (res) {


                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].title === res.choice) {
                        res.role_id = roles[i].id;
                    }
                }
                
                for (var i = 0; i < employees.length; i++) {
                    if (employees[i].first_name === res.manager) {
                        res.manager_id = employees[i].id;
                    }
                }


                var query = "INSERT INTO employee SET ?"
                const VALUES = {
                    first_name: res.firstname,
                    last_name: res.lastname,
                    role_id: res.role_id,
                    manager_id: res.manager_id
                }
                connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.log("Employee successfully added!");
                    determineAction()
                }

                )
            })
        })
    })

}


function viewAll() {
    connection.query("SELECT first_name AS FirstName, last_name as LastName, role.title as Role, role.salary AS Salary, department.name AS Department FROM employee LEFT JOIN role ON employee.role_id= role.id JOIN department ON role.department_id = department.id", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}

function viewAllDpt() {
    connection.query("SELECT * FROM department ", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}

function viewAllRoles() {
    connection.query("Select *  from role ", function (err, results) {
        console.table(results);
        if (err) throw err;
        determineAction()
    });
}


function addDpt() {
    inquirer
        .prompt({
            name: "newDpt",
            type: "input",
            message: "Which Department would you like to add?"
        })
        .then(function (result) {


            var query = "INSERT INTO department SET?"
            console.log(query)
            var query1 = connection.query(query, [{ name: result.newDpt }], function (err) {
                if (err) throw err;
                console.table("Department Created Successfully!");
                determineAction()
            });


        })
}

function addRole() {
    //selecting columns for department // loop over for department ID
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";

    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {
            if (err) throw err;

            inquirer.prompt([

                {
                    name: "role",
                    type: "input",
                    message: "Name of Role would you like to add?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the salary you would like to add?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which department this role belongs to?"
                },

            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "INSERT INTO role SET ?"
                const VALUES = {

                    title: result.role,
                    salary: result.newSalary,
                    department_id: result.department_id
                }
                connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly created!");
                    determineAction()
                });

            })
        })
    })
}





function updateRole() {
    
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;
            inquirer.prompt([

                {
                    name: "newRole",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arrayOfChoices.push(roles[i].title);
                        }

                        return arrayOfChoices;
                    },
                    message: "Which Role would you like to update?"
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the new salary for this role?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arrayOfChoices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arrayOfChoices.push(departments[i].name);
                        }
                        return arrayOfChoices;
                    },
                    message: "Which department this role belongs to?"
                },
            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
                const VALUES = [

                    { title: result.newRole },
                    { salary: result.newSalary },
                    { department_id: result.department_id }
                ]
                let query1 = connection.query(query, VALUES, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly Updated!");
                    determineAction()
                });

            })
        })
    })
}