import userRepository from "../repositories/user.repository.js";

export const getAllUsers = async () => {
    return await userRepository.getUsers();
};