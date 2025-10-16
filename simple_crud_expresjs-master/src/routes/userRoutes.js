const express = require('express');
const { UserController } = require('../controllers'); 
const validate = require('../middleware/validate');
const { userSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validate(userSchema), UserController.createUser);
router.put('/:id', validate(userSchema),  UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
