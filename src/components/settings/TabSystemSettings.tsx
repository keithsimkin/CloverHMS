/**
 * Tab System Settings Component
 * Provides UI for configuring tab system preferences
 */

import { useTabSettingsStore } from '@/stores/tabSettingsStore';
import { useTabStore } from '@/stores/tabStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  RectangleStackIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export function TabSystemSettings() {
  const settings = useTabSettingsStore();
  const tabStore = useTabStore();

  const handleMaxTabsChange = (value: number[]) => {
    const newMaxTabs = value[0];
    settings.updateSettings({ maxTabs: newMaxTabs });
    
    // Update the tab store's max tabs limit
    tabStore.maxTabs = newMaxTabs;
    
    toast({
      title: 'Maximum Tabs Updated',
      description: `Maximum tab limit set to ${newMaxTabs} tabs.`,
    });
  };

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    settings.updateSettings({ [key]: value });
    
    const labels: Record<string, string> = {
      enabled: 'Tab System',
      persistTabs: 'Tab Persistence',
      showTabIcons: 'Tab Icons',
      closeTabConfirmation: 'Close Confirmation',
    };
    
    toast({
      title: `${labels[key]} ${value ? 'Enabled' : 'Disabled'}`,
      description: `${labels[key]} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleReset = () => {
    settings.resetSettings();
    
    // Update the tab store's max tabs limit to default
    tabStore.maxTabs = 15;
    
    toast({
      title: 'Settings Reset',
      description: 'Tab system settings have been reset to defaults.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Tab System */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <RectangleStackIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="tab-system-enabled" className="text-base font-medium">
              Enable Tab System
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Turn the browser-like tab system on or off
          </p>
        </div>
        <Switch
          id="tab-system-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => handleToggle('enabled', checked)}
        />
      </div>

      {/* Maximum Tabs Slider */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="max-tabs-slider" className="text-base font-medium">
              Maximum Tabs
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Set the maximum number of tabs that can be open simultaneously (5-20)
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">5 tabs</span>
            <span className="text-sm font-medium">{settings.maxTabs} tabs</span>
            <span className="text-sm text-muted-foreground">20 tabs</span>
          </div>
          <Slider
            id="max-tabs-slider"
            min={5}
            max={20}
            step={1}
            value={[settings.maxTabs]}
            onValueChange={handleMaxTabsChange}
            disabled={!settings.enabled}
            className="w-full"
          />
        </div>
      </div>

      {/* Tab Persistence */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="tab-persistence" className="text-base font-medium">
              Tab Persistence
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Restore open tabs when the application restarts
          </p>
        </div>
        <Switch
          id="tab-persistence"
          checked={settings.persistTabs}
          onCheckedChange={(checked) => handleToggle('persistTabs', checked)}
          disabled={!settings.enabled}
        />
      </div>

      {/* Show Tab Icons */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <PhotoIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="show-tab-icons" className="text-base font-medium">
              Show Tab Icons
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Display icons in tab labels for better visual identification
          </p>
        </div>
        <Switch
          id="show-tab-icons"
          checked={settings.showTabIcons}
          onCheckedChange={(checked) => handleToggle('showTabIcons', checked)}
          disabled={!settings.enabled}
        />
      </div>

      {/* Close Confirmation */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="close-confirmation" className="text-base font-medium">
              Close Confirmation
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Show confirmation dialog when closing tabs with unsaved changes
          </p>
        </div>
        <Switch
          id="close-confirmation"
          checked={settings.closeTabConfirmation}
          onCheckedChange={(checked) => handleToggle('closeTabConfirmation', checked)}
          disabled={!settings.enabled}
        />
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Cog6ToothIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-500">
              Tab System Configuration
            </p>
            <p className="text-sm text-muted-foreground">
              These settings control the behavior of the browser-like tab system. 
              Changes take effect immediately and are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
