import { getUser, getRole } from '../repositories/signuplogin';

export const verifyUser = async (data) => {
    const user = await getUser(data);
    return user;
}
export const userRole = async (UUID) => {
    const role = await getRole(UUID);
    return role;
}