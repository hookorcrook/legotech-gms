# Role-Based Access Control (RBAC) Implementation

## Overview
The PulseFit Gym Management System now includes comprehensive Role-Based Access Control to ensure staff members only have access to modules relevant to their responsibilities.

## User Roles

### 1. Super Admin
- **Full system access** including Settings module
- Can manage all users, modules, and configurations
- Default credentials: `superadmin@pulsefit.com` / `password123`

### 2. Admin
- **Almost full access** except Settings
- Can manage most operational aspects
- Default credentials: `admin@pulsefit.com` / `password123`

### 3. Manager / Front Desk
- **Access to:**
  - 📊 Dashboard
  - 👥 Members
  - 📋 Plans (view only)
  - ✍️ Enrollments
  - 💳 Payments
  - 📈 Reports (limited)
- Default credentials: `manager@pulsefit.com` / `password123`

### 4. Trainer / Coach
- **Access to:**
  - 📊 Dashboard
  - 👥 Members (assigned only)
  - 📅 Classes
- Default credentials: `trainer@pulsefit.com` / `password123`

### 5. Accountant
- **Access to:**
  - 📊 Dashboard
  - 💳 Payments
  - 📈 Reports
- Default credentials: `accountant@pulsefit.com` / `password123`

### 6. Maintenance Staff
- **Access to:**
  - 📊 Dashboard
  - 🏋️ Equipment
  - 📹 CCTV
- Default credentials: `maintenance@pulsefit.com` / `password123`

## Module Access Matrix

| Module | Super Admin | Admin | Manager | Trainer | Accountant | Maintenance |
|--------|-------------|-------|---------|---------|------------|-------------|
| 📊 Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 👥 Members | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 📋 Plans | ✅ | ✅ | ✅ (view) | ❌ | ❌ | ❌ |
| ✍️ Enrollments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| 📅 Classes | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 🖼️ Gallery | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 🏋️ Equipment | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| 💳 Payments | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| 👔 Staff | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 📹 CCTV | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| 📈 Reports | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| ⚙️ Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Technical Implementation

### Backend

#### 1. Database Schema
```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  TRAINER
  ACCOUNTANT
  MAINTENANCE
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 2. Permission Middleware
Located at: `backend/src/middleware/permissions.ts`

```typescript
// Check permission for a module
export const checkPermission = (module: ModuleName) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const allowedRoles = ModulePermissions[module];
    
    if (!allowedRoles.includes(userRole as Role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Access denied'
      });
    }
    next();
  };
};
```

#### 3. Protected Routes
Routes use `checkPermission` middleware:

```typescript
// Example: Members module - accessible by SUPER_ADMIN, ADMIN, MANAGER, TRAINER
router.get('/admin/members', authMiddleware, checkPermission('members'), getMembers);

// Example: Settings - only SUPER_ADMIN
router.get('/admin/settings', authMiddleware, checkPermission('settings'), getSettings);
```

### Frontend

#### 1. Type Definitions
Located at: `frontend/types/admin.ts`

```typescript
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TRAINER = 'TRAINER',
  ACCOUNTANT = 'ACCOUNTANT',
  MAINTENANCE = 'MAINTENANCE',
}
```

#### 2. Permission Utilities
Located at: `frontend/lib/permissions.ts`

```typescript
// Check if user has permission for a module
export const hasPermission = (userRole: Role | undefined, module: ModuleName): boolean => {
  if (!userRole) return false;
  return ModulePermissions[module].includes(userRole);
};
```

#### 3. Dynamic Navigation
The admin sidebar automatically filters menu items based on user role:

```typescript
// Filter navigation items based on user's role permissions
const accessibleNavItems = navItems.filter(item => 
  hasPermission(user?.role, item.module)
);
```

#### 4. Permission Guard Hook
Located at: `frontend/hooks/usePermissions.ts`

```typescript
// Use in pages that require specific permissions
export function usePermissionGuard(module: ModuleName) {
  // Automatically redirects to access-denied if unauthorized
}
```

#### 5. Access Denied Page
Located at: `frontend/app/admin/access-denied/page.tsx`

Shows 403 error when user tries to access unauthorized modules.

## Usage Examples

### Creating a New User with Role
```typescript
const user = await prisma.user.create({
  data: {
    email: 'newuser@pulsefit.com',
    password: hashedPassword,
    name: 'New User',
    role: 'MANAGER',
  },
});
```

### Checking Permission in Frontend
```typescript
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/hooks/usePermissions';

function MyComponent() {
  const { user } = useAuth();
  
  if (hasPermission(user?.role, 'settings')) {
    return <SettingsButton />;
  }
  return null;
}
```

### Protecting a Page
```typescript
'use client';

import { usePermissionGuard } from '@/hooks/usePermissions';

export default function SettingsPage() {
  const { loading, hasAccess } = usePermissionGuard('settings');
  
  if (loading) return <Loading />;
  if (!hasAccess) return null; // Will redirect to access-denied
  
  return <SettingsContent />;
}
```

## Security Features

1. **Backend Validation**: All routes protected by middleware
2. **Frontend Guards**: Client-side checks prevent UI exposure
3. **Role Hierarchy**: Clearly defined permissions per role
4. **Token-Based**: JWT tokens include role information
5. **Database Constraints**: Role enum prevents invalid values

## Migration Notes

- Existing users will be assigned the SUPER_ADMIN role by default
- All test users have been seeded with `password123` for easy testing
- Previous `role: 'admin'` string values have been migrated to `Role.SUPER_ADMIN`

## Testing Roles

To test different role permissions:

1. Logout from current session
2. Login with one of the test accounts:
   - superadmin@pulsefit.com
   - admin@pulsefit.com
   - manager@pulsefit.com
   - trainer@pulsefit.com
   - accountant@pulsefit.com
   - maintenance@pulsefit.com
3. All passwords: `password123`
4. Observe different navigation items and access levels

## Future Enhancements

- [ ] Fine-grained permissions (read vs write)
- [ ] Custom role creation
- [ ] Permission inheritance
- [ ] Activity logging by role
- [ ] Time-based access restrictions
- [ ] Multi-role assignments
