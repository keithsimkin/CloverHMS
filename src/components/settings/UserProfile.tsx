/**
 * User Profile Settings Component
 * Allows users to view and update their profile information and change password
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Permission, Role } from '@/types/enums';
import { rolePermissions } from '@/config/permissions';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';

// Profile update schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function UserProfile() {
  const { user } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileUpdate = async (_data: ProfileFormData) => {
    try {
      // Mock profile update - in real implementation, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      showSuccessToast('Profile Updated', 'Your profile information has been updated successfully.');
      
      setIsEditingProfile(false);
    } catch (error) {
      showErrorToast('Update Failed', 'Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (_data: PasswordFormData) => {
    try {
      // Mock password change - in real implementation, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      showSuccessToast('Password Changed', 'Your password has been changed successfully.');
      
      passwordForm.reset();
      setIsChangingPassword(false);
    } catch (error) {
      showErrorToast('Password Change Failed', 'Failed to change password. Please try again.');
    }
  };

  const getRoleLabel = (role: Role): string => {
    const roleLabels: Record<Role, string> = {
      [Role.ADMIN]: 'System Administrator',
      [Role.HOSPITAL_ADMIN]: 'Hospital Administrator',
      [Role.DOCTOR]: 'Doctor',
      [Role.NURSE]: 'Nurse',
      [Role.RECEPTIONIST]: 'Receptionist',
      [Role.LAB_TECHNICIAN]: 'Lab Technician',
      [Role.PHARMACIST]: 'Pharmacist',
      [Role.ACCOUNTANT]: 'Accountant',
      [Role.INVENTORY_MANAGER]: 'Inventory Manager',
      [Role.VIEWER]: 'Read-Only Viewer',
    };
    return roleLabels[role] || role;
  };

  const getPermissionLabel = (permission: Permission): string => {
    return permission.replace(/_/g, ' ').replace(/:/g, ' - ').toUpperCase();
  };

  const userPermissions = user ? rolePermissions[user.role] || [] : [];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No user information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            View and update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Staff ID</Label>
                <p className="text-sm text-muted-foreground mt-1">{user.staffId || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <div className="mt-1">
                  <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register('firstName')}
                    disabled={!isEditingProfile}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register('lastName')}
                    disabled={!isEditingProfile}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                  disabled={!isEditingProfile}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!isEditingProfile ? (
                  <Button type="button" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        profileForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update Password</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    passwordForm.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Permissions</CardTitle>
          <CardDescription>
            Permissions granted to your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {userPermissions.map((permission) => (
              <Badge key={permission} variant="outline" className="justify-start">
                {getPermissionLabel(permission)}
              </Badge>
            ))}
          </div>
          {userPermissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No permissions assigned</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
