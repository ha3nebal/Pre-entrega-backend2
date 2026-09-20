import userDAO from "../dao/UserDAO.js";

class UserRepository {

    async getUsers() {
        return await userDAO.getAll();
    }

    async getUserById(id) {
        return await userDAO.getById(id);
    }

    async getUserByEmail(email) {
        return await userDAO.getByEmail(email);
    }

    async createUser(user) {
        return await userDAO.create(user);
    }

}

export default new UserRepository();