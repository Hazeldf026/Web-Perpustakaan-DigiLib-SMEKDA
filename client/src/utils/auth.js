
export const getUserId = () => {
    const userStr = localStorage.getItem('user_data');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.id) return user.id;

    const token = localStorage.getItem('user_token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.id || null;
    } catch {
        return null;
    }
};

export const isAdminAuthenticated = () => {
    return !!localStorage.getItem('admin_token');
};

export const isUserAuthenticated = () => {
    return !!localStorage.getItem('user_token');
};