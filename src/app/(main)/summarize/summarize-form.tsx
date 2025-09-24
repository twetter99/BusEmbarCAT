'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { summarizeMaintenanceLogs } from '@/ai/flows/summarize-maintenance-logs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const defaultLogs = `
- Vehicle BC-456-Y: GPS module reset twice this week. Operator reported intermittent signal loss.
- Vehicle BC-123-X: Replaced worn brake pads. Fluid levels topped up.
- Vehicle BC-789-Z: Validator firmware updated to v2.3.1. One instance of a card read failure during testing, but could not replicate.
- All vehicles: standard fluid and tire pressure checks completed.
`.trim();

const defaultChecklist = `
- Inspect physical condition
- Clean card reader
- Verify firmware version
- Run diagnostic test
- Test with multiple card types
- Check connections
- Confirm transaction logging
`.trim();

type FormData = {
  maintenanceLogs: string;
  checklist: string;
};

export function SummarizeForm() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      maintenanceLogs: defaultLogs,
      checklist: defaultChecklist,
    },
  });
  const [summary, setSummary] = useState('');
  const [failurePoints, setFailurePoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSummary('');
    setFailurePoints('');
    try {
      const result = await summarizeMaintenanceLogs(data);
      setSummary(result.summary);
      setFailurePoints(result.potentialFailurePoints);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Summary',
        description: 'An error occurred while processing the logs. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Log Summarization</CardTitle>
          <CardDescription>
            Enter maintenance logs and an optional checklist to generate an AI-powered summary and identify potential failure points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceLogs">Maintenance Logs</Label>
              <Textarea
                id="maintenanceLogs"
                rows={10}
                placeholder="Paste maintenance logs here..."
                {...register('maintenanceLogs')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checklist">Maintenance Checklist (Optional)</Label>
              <Textarea
                id="checklist"
                rows={6}
                placeholder="Provide checklist items for context..."
                {...register('checklist')}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Generating...' : 'Generate Summary'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>A concise overview of the provided logs.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !summary && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {summary && <p className="text-sm">{summary}</p>}
            {!isLoading && !summary && <p className="text-sm text-muted-foreground">Summary will appear here after generation.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-destructive/10 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
                <CardTitle>Potential Failure Points</CardTitle>
                <CardDescription>AI-suggested areas to monitor.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
          {isLoading && !failurePoints && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {failurePoints && <p className="text-sm">{failurePoints}</p>}
            {!isLoading && !failurePoints && <p className="text-sm text-muted-foreground">Potential failures will be identified here.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
