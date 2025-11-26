/**
 * Login Page
 * Provides authentication interface with email/password form using shadcn login-05 design
 */

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/authStore';
import { getLockoutTimeRemaining } from '@/lib/auth';
import { AlertCircle, Loader2, Activity } from 'lucide-react';
import { TauriTitleBar } from '@/components/layout/TauriTitleBar';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, isAccountLocked } = useAuthStore();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      // Redirect to dashboard on successful login
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const accountLocked = isAccountLocked();
  const lockoutTime = getLockoutTimeRemaining();

  return (
    <>
      <TauriTitleBar />
      <div className="flex min-h-screen items-center justify-center bg-background p-4 pt-12">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <Activity className="size-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-heading">Hospital Management System</h1>
              <div className="text-center text-sm text-muted-foreground">
                Enter your credentials to access the system
              </div>
            </div>

            {/* Error Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {accountLocked && lockoutTime && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Account is locked. Please try again in {lockoutTime}.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@hospital.com"
                  disabled={isLoading || accountLocked}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading || accountLocked}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || accountLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Demo Credentials
              </span>
            </div>

            {/* Demo Credentials */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">admin@hospital.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="font-mono">doctor@hospital.com / doctor123</span>
              </div>
              <div className="flex justify-between">
                <span>Nurse:</span>
                <span className="font-mono">nurse@hospital.com / nurse123</span>
              </div>
              <div className="flex justify-between">
                <span>Receptionist:</span>
                <span className="font-mono">receptionist@hospital.com / reception123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
