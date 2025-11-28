import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Define role hierarchy and permissions
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TRAINER = 'TRAINER',
  ACCOUNTANT = 'ACCOUNTANT',
  MAINTENANCE = 'MAINTENANCE',
}

// Module access control map
export const ModulePermissions = {
  dashboard: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.TRAINER, Role.ACCOUNTANT, Role.MAINTENANCE],
  members: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.TRAINER],
  plans: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  enrollments: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  classes: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.TRAINER],
  gallery: [Role.SUPER_ADMIN, Role.ADMIN],
  equipment: [Role.SUPER_ADMIN, Role.ADMIN, Role.MAINTENANCE],
  payments: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT],
  staff: [Role.SUPER_ADMIN, Role.ADMIN],
  users: [Role.SUPER_ADMIN, Role.ADMIN],
  cctv: [Role.SUPER_ADMIN, Role.ADMIN, Role.MAINTENANCE],
  reports: [Role.SUPER_ADMIN, Role.ADMIN, Role.ACCOUNTANT],
  settings: [Role.SUPER_ADMIN],
  testimonials: [Role.SUPER_ADMIN, Role.ADMIN],
};

// Type for module names
export type ModuleName = keyof typeof ModulePermissions;

/**
 * Middleware to check if user has permission to access a specific module
 * @param module - The module name to check permissions for
 */
export const checkPermission = (module: ModuleName) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated' 
      });
    }

    const allowedRoles = ModulePermissions[module];

    if (!allowedRoles.includes(userRole as Role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Access denied. Your role (${userRole}) does not have permission to access this module.`,
        module,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has one of the specified roles
 * @param roles - Array of roles that are allowed
 */
export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated' 
      });
    }

    if (!roles.includes(userRole as Role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        userRole,
        requiredRoles: roles,
      });
    }

    next();
  };
};

/**
 * Check if a user role has permission for a module (utility function)
 */
export const hasPermission = (userRole: string, module: ModuleName): boolean => {
  const allowedRoles = ModulePermissions[module];
  return allowedRoles.includes(userRole as Role);
};

/**
 * Get all modules accessible by a role
 */
export const getAccessibleModules = (userRole: string): ModuleName[] => {
  return Object.keys(ModulePermissions).filter(module => 
    ModulePermissions[module as ModuleName].includes(userRole as Role)
  ) as ModuleName[];
};
