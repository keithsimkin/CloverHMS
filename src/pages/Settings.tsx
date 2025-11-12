import { MainLayout } from '@/components/layout/MainLayout';

export function Settings() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Settings' },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure system settings and preferences
          </p>
        </div>

        <div className="p-6 bg-gunmetal rounded-lg border border-border">
          <p className="text-muted-foreground">
            Settings interface coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
