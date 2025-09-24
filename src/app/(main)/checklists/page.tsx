'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockChecklist } from '@/lib/data';

export default function ChecklistsPage() {
  const [checklistItems, setChecklistItems] = React.useState(mockChecklist.items);

  const handleCheckedChange = (itemId: string, checked: boolean) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, completed: checked } : item
      )
    );
  };

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{mockChecklist.title}</CardTitle>
            <CardDescription>
              Vehicle: BC-123-X | Technician: Alice
            </CardDescription>
            <div className="flex items-center gap-2 pt-2">
              <Progress value={progressPercentage} className="w-full" />
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount}/{totalCount}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                {checklistItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex items-center space-x-4 rounded-md p-2 transition-colors hover:bg-muted/50">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={(checked) => handleCheckedChange(item.id, !!checked)}
                      />
                      <Label
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </Label>
                    </div>
                    {index < checklistItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit Checklist</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
