import { Card } from '@/components/ui/card';

export interface AgeDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface VisitFrequency {
  frequency: string;
  count: number;
}

export interface PatientTypeDistribution {
  opd: number;
  ipd: number;
}

interface PatientDemographicsProps {
  ageDistribution: AgeDistribution[];
  visitFrequency: VisitFrequency[];
  patientTypes: PatientTypeDistribution;
}

export function PatientDemographics({
  ageDistribution,
  visitFrequency,
  patientTypes,
}: PatientDemographicsProps) {
  const maxAgeCount = Math.max(...ageDistribution.map((d) => d.count), 1);
  const maxVisitCount = Math.max(...visitFrequency.map((v) => v.count), 1);
  const totalPatients = patientTypes.opd + patientTypes.ipd;
  const opdPercentage =
    totalPatients > 0 ? ((patientTypes.opd / totalPatients) * 100).toFixed(1) : '0';
  const ipdPercentage =
    totalPatients > 0 ? ((patientTypes.ipd / totalPatients) * 100).toFixed(1) : '0';

  return (
    <Card className="p-6 bg-gunmetal border-border">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Patient Demographics
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Patient distribution and statistics
          </p>
        </div>

        {/* Age Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Age Distribution</h4>
          <div className="space-y-2">
            {ageDistribution.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.ageGroup}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">
                      {item.count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="relative h-6 bg-rich-black rounded overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-400 transition-all"
                    style={{ width: `${(item.count / maxAgeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Frequency */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Visit Frequency
          </h4>
          <div className="space-y-2">
            {visitFrequency.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.frequency}</span>
                  <span className="text-foreground font-medium">{item.count}</span>
                </div>
                <div className="relative h-6 bg-rich-black rounded overflow-hidden">
                  <div
                    className="absolute h-full bg-purple-400 transition-all"
                    style={{ width: `${(item.count / maxVisitCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OPD vs IPD */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            OPD vs IPD Patients
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-rich-black rounded-lg">
              <p className="text-xs text-muted-foreground">OPD</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {patientTypes.opd}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {opdPercentage}% of total
              </p>
            </div>
            <div className="p-4 bg-rich-black rounded-lg">
              <p className="text-xs text-muted-foreground">IPD</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {patientTypes.ipd}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {ipdPercentage}% of total
              </p>
            </div>
          </div>
          {/* Visual bar */}
          <div className="relative h-8 bg-rich-black rounded overflow-hidden">
            <div
              className="absolute h-full bg-green-400 transition-all"
              style={{ width: `${opdPercentage}%` }}
            />
            <div
              className="absolute h-full bg-cyan-400 transition-all"
              style={{ width: `${ipdPercentage}%`, left: `${opdPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded" />
              <span className="text-muted-foreground">Outpatient (OPD)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded" />
              <span className="text-muted-foreground">Inpatient (IPD)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
