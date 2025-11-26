import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Shortcut {
  keys: string;
  description: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: Shortcut[];
}

// Detect if we're on macOS for displaying correct shortcuts
const isMac = typeof navigator !== 'undefined' && 
  (navigator.userAgent.toUpperCase().indexOf('MAC') >= 0 || 
   navigator.userAgent.toUpperCase().indexOf('DARWIN') >= 0);

const modKey = isMac ? 'Cmd' : 'Ctrl';

const shortcutSections: ShortcutSection[] = [
  {
    title: 'Global',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Open command palette (coming soon)' },
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: 'Esc', description: 'Close dialogs and modals' },
    ],
  },
  {
    title: 'Tab Management',
    shortcuts: [
      { keys: `${modKey}+T`, description: 'Open new Dashboard tab' },
      { keys: `${modKey}+W`, description: 'Close active tab' },
      { keys: 'Ctrl+Tab', description: 'Switch to next tab' },
      { keys: 'Ctrl+Shift+Tab', description: 'Switch to previous tab' },
      { keys: `${modKey}+1-9`, description: 'Switch to tab by index' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: 'Ctrl+H', description: 'Go to Dashboard' },
      { keys: 'Ctrl+P', description: 'Go to Patients' },
      { keys: 'Ctrl+A', description: 'Go to Appointments' },
    ],
  },
  {
    title: 'Forms',
    shortcuts: [
      { keys: 'Ctrl+S', description: 'Save form' },
      { keys: 'Ctrl+Enter', description: 'Submit form' },
      { keys: 'Tab', description: 'Navigate to next field' },
      { keys: 'Shift+Tab', description: 'Navigate to previous field' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: 'Ctrl+N', description: 'Create new record' },
      { keys: 'Ctrl+E', description: 'Edit selected record' },
      { keys: 'Delete', description: 'Delete selected record' },
    ],
  },
];

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the application more efficiently.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {shortcutSections.map((section, index) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.keys}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
                {index < shortcutSections.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
