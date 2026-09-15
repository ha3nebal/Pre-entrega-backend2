export const toUserDTO = (user) => {
    if (!user) {
        return null;
    }

    return {
        id: user._id?.toString() || user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };
};

export const toAuthenticatedUserDTO = (user) => {
    if (!user) {
        return null;
    }

    return {
        id: user._id?.toString() || user.id,
        email: user.email,
        role: user.role
    };
};