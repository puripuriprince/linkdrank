import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Award {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  awardDate: { year: number; month?: number };
  issuer: string;
}

interface AwardsCardSectionProps {
  awards: Award[];
}

function formatAwardDate(date: { year: number; month?: number }): string {
  if (date.month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.month - 1]} ${date.year}`;
  }
  return date.year.toString();
}

export function AwardsCardSection({ awards }: AwardsCardSectionProps) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-medium text-lg">
          <Trophy className="mr-2 h-4 w-4 text-primary" />
          Awards & Honors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {awards.map((award) => (
            <div key={award.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground">
                  {award.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {award.issuer}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatAwardDate(award.awardDate)}
                </p>
                {award.description && (
                  <p className="text-sm text-muted-foreground">
                    {award.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 