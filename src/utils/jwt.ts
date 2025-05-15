import cookies from 'react-cookies';

interface JwtPayload {
    UserId: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Role: string;
    Permissions: {
        $id: string;
        $values: string[];
    };
    exp: number;
    iss: string;
    aud: string;
}

export const isAdmin = (): boolean => {
    const token = cookies.load('token');
    console.log('Token exists:', !!token);

    if (!token) return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const payload: JwtPayload = JSON.parse(jsonPayload);
        console.log('JWT Payload:', payload);
        console.log('User permissions:', payload.Permissions.$values);

        const isAdmin = payload.Permissions.$values.includes('Administrator');
        console.log('Is admin:', isAdmin);

        return isAdmin;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return false;
    }
};

export const getPermissions = (): string[] => {
    const token = cookies.load('token');
    console.log('Token exists:', !!token);

    if (!token) return [];

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const payload: JwtPayload = JSON.parse(jsonPayload);
        console.log('JWT Payload:', payload);
        console.log('User permissions:', payload.Permissions.$values);

        return payload.Permissions.$values;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return [];
    }
}; 