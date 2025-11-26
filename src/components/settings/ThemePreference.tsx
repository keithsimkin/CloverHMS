/**
 * Theme Preference Component
 * Allows users to select their preferred theme (light/dark)
 */

import { Moon, Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useThemeStore, Theme } from '@/stores/themeStore';

export function ThemePreference() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="text-sm font-medium">Theme</Label>
        <p className="text-xs text-muted-foreground">
          Choose your preferred color scheme
        </p>
      </div>
      <RadioGroup
        value={theme}
        onValueChange={(value: string) => setTheme(value as Theme)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
            <Sun className="h-4 w-4" />
            <span className="text-sm">Light</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
            <Moon className="h-4 w-4" />
            <span className="text-sm">Dark</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
