/**
 * Settings Page
 * Provides access to user profile, agent hooks, steering rules, and system settings
 */

import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/settings/UserProfile';
import { HooksManager } from '@/components/settings/HooksManager';
import { SteeringManager } from '@/components/settings/SteeringManager';
import { ThemePreference } from '@/components/settings/ThemePreference';
import { TabSystemSettings } from '@/components/settings/TabSystemSettings';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/types/enums';
import { 
  UserCircleIcon, 
  CogIcon, 
  DocumentTextIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

export default function Settings() {
  const { hasPermission } = usePermissions();

  const canManageHooks = hasPermission(Permission.AGENT_HOOKS_MANAGE);
  const canManageSteering = hasPermission(Permission.STEERING_MANAGE);
  const canManageSettings = hasPermission(Permission.SETTINGS_MANAGE);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, configure automation, and customize system behavior
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="hooks" 
            className="flex items-center gap-2"
            disabled={!canManageHooks}
          >
            <CogIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Agent Hooks</span>
          </TabsTrigger>
          <TabsTrigger 
            value="steering" 
            className="flex items-center gap-2"
            disabled={!canManageSteering}
          >
            <DocumentTextIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Steering Rules</span>
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="flex items-center gap-2"
            disabled={!canManageSettings}
          >
            <WrenchScrewdriverIcon className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* User Profile Tab */}
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>

        {/* Agent Hooks Tab */}
        <TabsContent value="hooks">
          {canManageHooks ? (
            <HooksManager />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You don't have permission to manage agent hooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact your system administrator to request access to this feature.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Steering Rules Tab */}
        <TabsContent value="steering">
          {canManageSteering ? (
            <SteeringManager />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You don't have permission to manage steering rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact your system administrator to request access to this feature.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          {canManageSettings ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Configure system-wide settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Appearance</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Customize the look and feel of the application
                      </p>
                      <div className="space-y-3">
                        <ThemePreference />
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Tab System</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure the browser-like tab system behavior and preferences
                      </p>
                      <div className="space-y-4">
                        <TabSystemSettings />
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Application Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure general application behavior and preferences
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Session Timeout</p>
                            <p className="text-xs text-muted-foreground">
                              Automatically log out users after inactivity
                            </p>
                          </div>
                          <span className="text-sm">30 minutes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Failed Login Attempts</p>
                            <p className="text-xs text-muted-foreground">
                              Lock account after failed attempts
                            </p>
                          </div>
                          <span className="text-sm">3 attempts</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Account Lockout Duration</p>
                            <p className="text-xs text-muted-foreground">
                              Duration of account lockout
                            </p>
                          </div>
                          <span className="text-sm">15 minutes</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Database Configuration</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supabase connection and database settings
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Connection Status</p>
                            <p className="text-xs text-muted-foreground">
                              Current database connection status
                            </p>
                          </div>
                          <span className="text-sm text-green-600">Connected (Mock)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Row Level Security</p>
                            <p className="text-xs text-muted-foreground">
                              Database-level access control
                            </p>
                          </div>
                          <span className="text-sm">Enabled</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Data Management</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage application data and backups
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Pagination Size</p>
                            <p className="text-xs text-muted-foreground">
                              Number of records per page
                            </p>
                          </div>
                          <span className="text-sm">20 records</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Data Retention</p>
                            <p className="text-xs text-muted-foreground">
                              How long to keep historical data
                            </p>
                          </div>
                          <span className="text-sm">Indefinite</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Notifications</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure system notifications and alerts
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Low Stock Alerts</p>
                            <p className="text-xs text-muted-foreground">
                              Notify when inventory is low
                            </p>
                          </div>
                          <span className="text-sm">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Appointment Reminders</p>
                            <p className="text-xs text-muted-foreground">
                              Send reminders for upcoming appointments
                            </p>
                          </div>
                          <span className="text-sm">24 hours before</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 bg-muted/50">
                      <h3 className="font-medium mb-2">About</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Version</span>
                          <span className="font-mono">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Build Date</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Environment</span>
                          <span>Development</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You don't have permission to manage system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact your system administrator to request access to this feature.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  );
}
