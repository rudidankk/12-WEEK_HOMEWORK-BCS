const actions = [

    {
        type: "list",
        name: "actions",
        message: "What is your role?",
        choices: [
            "Add department",
            "Add role",
            "Add new employee",
            "View all departments",
            "View all roles",
            "View all employees",
            
            "Update employee role",
            "Exit"

        ]

    }
]



module.exports = { actions }

