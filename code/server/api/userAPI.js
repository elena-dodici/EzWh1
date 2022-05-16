const UserManager = require("../bin/controller/UserManager");

const types = [
	"administrator",
	"manager",
	"customer",
	"supplier",
	"clerk",
	"qualityEmployee",
	"deliveryEmployee",
];

const { validationResult } = require("express-validator");

exports.getUserInfo = function (req, res) {
	//returns current user information
	return res.status(200).json();
};

exports.getSuppliers = function (req, res) {
	UserManager.getAllSuppliers().then(
		(suppliers) => {
			const suppAPI = suppliers.map((s) => ({
				id: s.id,
				name: s.name,
				surname: s.surname,
				email: s.username,
			}));
			return res.status(200).json(suppAPI);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.getUsers = function (req, res) {
	UserManager.getAllUsers().then(
		(users) => {
			const usersAPI = users.map((u) => ({
				id: u.id,
				name: u.name,
				surname: u.surname,
				email: u.username,
				type: u.type,
			}));
			return res.status(200).json(usersAPI);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

const possiblePostTypes = [
	"customer",
	"supplier",
	"customer",
	"supplier",
	"clerk",
	"quality employee",
	"delivery employee",
];

exports.postUserSchema = {
	name: {
		notEmpty: true,
		isAlpha: true,
	},
	surname: {
		notEmpty: true,
		isAlpha: true,
	},
	password: {
		notEmpty: true,
		isLength: {
			options: {min: 8}
		}
	},
	username: {
		notEmpty: true,
		isEmail: true,
	},
	type: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
};

exports.postUser = function (req, res) {
	const name = req.body.name;
	const surname = req.body.surname;
	const password = req.body.password;
	const username = req.body.username;
	const type = req.body.type;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
			//error: "Validation of request body failed or attempt to create manager or administrator accounts",
		});
	}

	//Controlla che l'username non sia già stato preso!!!
	UserManager.defineUser(name, surname, password, username, type).then(
		(result) => {
			return res.status(201).end();
		},
		(error) => {
			switch (error) {
				case "503":
					
					return res.status(503).json({ error: "generic error" });
				case "409 email type":
					return res
						.status(409)
						.json({
							error: "user with same mail and type already exists",
						});
				default:
					return res.status(503).json({ error: "generic error" });
			}
		}
	);
};

/* Not requested in api
exports.loginSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    }
}*/

exports.managerSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(username, password, "manager").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.customerSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(username, password, "customer").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			console.log(error);
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.supplierSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(username, password, "supplier").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.clerkSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(username, password, "clerk").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.qualityEmployeeSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(username, password, "qualityEmployee").then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.deliveryEmployeeSessions = function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const user = UserManager.login(
		username,
		password,
		"deliveryEmployee"
	).then(
		(result) => {
			return res.status(200).json(result);
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.logout = function (req, res) {
	UserManager.logout().then(
		(result) => {
			return res.status(200).end();
		},
		(error) => {
			return res.status(500).json({ error: "generic error" });
		}
	);
};

exports.putUserSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    oldType: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
    newType: {
        notEmpty: true,
        custom: {
            options: (value, {req, location, path}) => {
                if (types.includes(value)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
}

exports.putUser = function (req, res) {

    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: "validation of request body or of username failed or attempt to modify rights to administrator or manager",
		});
	}
	const username = req.params.username;
    //oldType can't be manager or administrator
	const oldType = req.body.oldType;
	const newType = req.body.newType;

	UserManager.modifyUser(username, oldType, newType).then(
		(result) => {
			return res.status(200).end();
		},
		(error) => {
			switch (error) {
				case "404":
					return res.status(404).json({ error: "wrong username or oldType fields or user doesn't exists)" });
                default: 
                    return res.status(503).json({error: "generic error"});
                
			}
		}
	);
};

exports.deleteUserSchema = {
    username: {
        notEmpty: true,
        isEmail: true
    },
    type: {
		notEmpty: true,
		custom: {
			options: (value, { req, location, path }) => {
				if (possiblePostTypes.includes(value)) {
					return true;
				} else {
					return false;
				}
			},
		},
	},
}

exports.deleteUser = function(req,res) {
    const username = req.params.username;
    const type = req.params.type;

    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: "validation of username or of type failed or attempt to delete a manager/administrator",
		});
	}

    UserManager.deleteUser(username, type).then(
        result => {
            return res.status(204).end();
        },
        error => {
            console.log(error);
            return res.status(503).json({error: "generic error"});
        }
    )


}
