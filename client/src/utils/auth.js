/**
 * Ambil user ID dari localStorage.
 * - Pertama coba dari field 'user.id' (tersedia setelah login dengan server terbaru).
 * - Jika tidak ada (user lama yang login sebelum fix), decode dari JWT token sebagai fallback.
 */
export const getUserId = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Kasus normal: user.id ada
    if (user?.id) return user.id;

    // Fallback: decode JWT untuk ambil id
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // JWT terdiri dari 3 bagian: header.payload.signature
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.id || null;
    } catch {
        return null;
    }
};
