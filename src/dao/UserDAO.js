import User from "../models/User.js";

class UserDAO {

    async getAll() {
        return await User.find();
    }

    async getById(id) {
        return await User.findById(id);
    }

    async create(userData) {
        return await User.create(userData);
    }

    async getByEmail(email) {
        return await User.findOne({ email });
    }

}

export default new UserDAO();