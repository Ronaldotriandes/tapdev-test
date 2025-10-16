const { UserService } = require('../services');

class UserController {
    async getAllUsers(req, res) {
        const users = UserService.getAllUsers();
        res.json(users);
    }

    async getUserById(req, res) {
        const user = UserService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }

    async createUser(req, res) {
        const { name, email, age, bod } = req.body;
        const user = UserService.createUser(name, email, age, bod);
        res.status(201).json({
            message: 'User created successfully',
            user,
        });
    }

    async updateUser(req, res) {
        const user = UserService.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }

    async deleteUser(req, res) {
        const user = UserService.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
}

module.exports = new UserController();
