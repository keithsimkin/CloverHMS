/**
 * DrugInteractionWarning Component
 * Displays warnings when prescribing multiple medicines with potential interactions
 * Requirements: 12.4
 */

import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Medicine } from '@/types/models';

export interface DrugInteraction {
  medicine1: Medicine;
  medicine2: Medicine;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  description: string;
  recommendation?: string;
}

interface DrugInteractionWarningProps {
  interactions: DrugInteraction[];
  onDismiss?: (index: number) => void;
  className?: string;
}

const severityConfig = {
  minor: {
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    badgeVariant: 'secondary' as const,
    label: 'Minor',
  },
  moderate: {
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    badgeVariant: 'outline' as const,
    label: 'Moderate',
  },
  major: {
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    badgeVariant: 'outline' as const,
    label: 'Major',
  },
  severe: {
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    badgeVariant: 'destructive' as const,
    label: 'Severe',
  },
};

export function DrugInteractionWarning({
  interactions,
  onDismiss,
  className,
}: DrugInteractionWarningProps) {
  if (interactions.length === 0) {
    return null;
  }

  // Sort interactions by severity (severe first)
  const sortedInteractions = [...interactions].sort((a, b) => {
    const severityOrder = { severe: 0, major: 1, moderate: 2, minor: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const hasSevereInteractions = interactions.some(
    (i) => i.severity === 'severe' || i.severity === 'major'
  );

  return (
    <div className={className}>
      {/* Summary Alert */}
      <Alert variant={hasSevereInteractions ? 'destructive' : 'default'} className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Drug Interaction Warning</AlertTitle>
        <AlertDescription>
          {interactions.length} potential drug interaction{interactions.length > 1 ? 's' : ''}{' '}
          detected. Please review before prescribing.
          {hasSevereInteractions && (
            <span className="block mt-1 font-medium">
              ⚠️ Critical interactions found - immediate attention required.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Detailed Interactions */}
      <div className="space-y-3">
        {sortedInteractions.map((interaction, index) => {
          const config = severityConfig[interaction.severity];
          
          return (
            <Card key={index} className={`border-2 ${config.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={config.badgeVariant} className="font-semibold">
                        {config.label}
                      </Badge>
                      <CardTitle className="text-base">Drug Interaction</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{interaction.medicine1.medicine_name}</Badge>
                      <span className="text-muted-foreground">×</span>
                      <Badge variant="outline">{interaction.medicine2.medicine_name}</Badge>
                    </div>
                  </div>
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Interaction Details</h4>
                  <p className="text-sm text-muted-foreground">{interaction.description}</p>
                </div>

                {interaction.recommendation && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        Recommendation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {interaction.recommendation}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1">{interaction.medicine1.medicine_name}</p>
                    <p className="text-muted-foreground">
                      Generic: {interaction.medicine1.generic_name}
                    </p>
                    <p className="text-muted-foreground">
                      Category: {interaction.medicine1.therapeutic_category}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">{interaction.medicine2.medicine_name}</p>
                    <p className="text-muted-foreground">
                      Generic: {interaction.medicine2.generic_name}
                    </p>
                    <p className="text-muted-foreground">
                      Category: {interaction.medicine2.therapeutic_category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Guidance */}
      {hasSevereInteractions && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            Severe or major drug interactions detected. Consider:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Consulting with a pharmacist or senior physician</li>
              <li>Adjusting dosages or timing of administration</li>
              <li>Selecting alternative medications</li>
              <li>Implementing additional patient monitoring</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Utility function to check for drug interactions between medicines
 * This is a simplified mock implementation - real implementation would use a comprehensive drug interaction database
 */
export function checkDrugInteractions(medicines: Medicine[]): DrugInteraction[] {
  const interactions: DrugInteraction[] = [];

  // Check each pair of medicines
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const med1 = medicines[i];
      const med2 = medicines[j];

      // Check if med1 lists med2 in its interactions
      if (
        med1.drug_interactions?.some(
          (interaction) =>
            interaction.toLowerCase() === med2.medicine_name.toLowerCase() ||
            interaction.toLowerCase() === med2.generic_name.toLowerCase()
        )
      ) {
        interactions.push({
          medicine1: med1,
          medicine2: med2,
          severity: determineSeverity(med1, med2),
          description: `${med1.medicine_name} may interact with ${med2.medicine_name}, potentially affecting efficacy or increasing side effects.`,
          recommendation: getRecommendation(med1, med2),
        });
      }
    }
  }

  return interactions;
}

/**
 * Determine interaction severity based on medicine properties
 * Mock implementation - real system would use clinical database
 */
function determineSeverity(med1: Medicine, med2: Medicine): DrugInteraction['severity'] {
  // Mock logic - in reality this would be based on clinical data
  const criticalCategories = ['Anticoagulant', 'Antiarrhythmic', 'Immunosuppressant'];
  
  if (
    criticalCategories.includes(med1.therapeutic_category) ||
    criticalCategories.includes(med2.therapeutic_category)
  ) {
    return 'severe';
  }

  if (med1.therapeutic_category === med2.therapeutic_category) {
    return 'major';
  }

  return Math.random() > 0.5 ? 'moderate' : 'minor';
}

/**
 * Get recommendation based on interaction
 * Mock implementation - real system would provide specific clinical guidance
 */
function getRecommendation(_med1: Medicine, _med2: Medicine): string {
  const recommendations = [
    'Monitor patient closely for adverse effects. Consider spacing administration times by at least 2 hours.',
    'Adjust dosage as needed. Regular monitoring of therapeutic levels recommended.',
    'Consider alternative medication if possible. If both are necessary, implement enhanced patient monitoring.',
    'Administer at different times of day. Monitor for reduced efficacy or increased side effects.',
  ];

  return recommendations[Math.floor(Math.random() * recommendations.length)];
}
