import { MainLayout } from '@/components/layout/MainLayout';

export function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of hospital operations and key metrics
          </p>
        </div>

        {/* Dashboard content will be implemented in later tasks */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-gunmetal rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Patients
            </h3>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
          </div>
          <div className="p-6 bg-gunmetal rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">
              Appointments Today
            </h3>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
          </div>
          <div className="p-6 bg-gunmetal rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Staff
            </h3>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
          </div>
          <div className="p-6 bg-gunmetal rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </h3>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
