/**
 * UnsavedChangesExample Component
 * 
 * Example component demonstrating how to use the useUnsavedChanges hook
 * in a form component. This serves as a reference implementation for
 * integrating unsaved changes detection with the tab system.
 */

import { useState, useEffect } from 'react';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example form component with unsaved changes detection
 */
export function UnsavedChangesExample() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  // Track if form has been modified
  const [isModified, setIsModified] = useState(false);
  
  // Original values for comparison
  const [originalValues] = useState({ name: '', email: '', notes: '' });

  // Use the unsaved changes hook
  const { isDirty, setIsDirty, markAsSaved, save } = useUnsavedChanges({
    onSave: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form saved:', { name, email, notes });
      // Update original values after save
      setIsModified(false);
    },
    onDiscard: () => {
      // Reset form to original values
      setName(originalValues.name);
      setEmail(originalValues.email);
      setNotes(originalValues.notes);
      setIsModified(false);
    },
  });

  // Check if form has been modified
  useEffect(() => {
    const hasChanges = 
      name !== originalValues.name ||
      email !== originalValues.email ||
      notes !== originalValues.notes;
    
    setIsModified(hasChanges);
    setIsDirty(hasChanges);
  }, [name, email, notes, originalValues, setIsDirty]);

  const handleSave = async () => {
    await save();
  };

  const handleReset = () => {
    setName(originalValues.name);
    setEmail(originalValues.email);
    setNotes(originalValues.notes);
    markAsSaved();
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Unsaved Changes Example</CardTitle>
          <CardDescription>
            Try editing the form fields below, then attempt to close this tab.
            You'll see a confirmation dialog if there are unsaved changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status indicator */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-orange-500' : 'bg-green-500'}`} />
            <span className="text-sm font-medium">
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notes"
                rows={4}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!isModified}>
              Save Changes
            </Button>
            <Button onClick={handleReset} variant="outline" disabled={!isModified}>
              Reset
            </Button>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <h3 className="font-semibold text-sm">How to test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Edit any of the form fields above</li>
              <li>Notice the orange dot appears in the tab (unsaved changes indicator)</li>
              <li>Try to close this tab by clicking the X button</li>
              <li>A confirmation dialog will appear with options to save, discard, or cancel</li>
              <li>You can also test with keyboard shortcuts (Ctrl+W / Cmd+W)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
