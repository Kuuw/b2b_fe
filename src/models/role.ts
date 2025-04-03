export interface Permission {
    permissionId: string;
    permissionName: string;
    description?: string;
}

export interface Role {
    roleId: string;
    roleName: string;
    description?: string;
    permissions: Permission[];
}

export interface RoleCreate {
    roleName: string;
    description?: string;
    permissions: Permission[];
}

export interface RoleUpdate extends RoleCreate {
    roleId: string;
} 