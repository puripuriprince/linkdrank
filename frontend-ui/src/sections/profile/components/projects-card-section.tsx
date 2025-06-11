import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

interface Project {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  startDate: { year: number; month?: number } | null;
  endDate: { year: number; month?: number } | null;
}

interface ProjectsCardSectionProps {
  projects: Project[];
}

function formatDate(date: { year: number; month?: number } | null): string {
  if (!date || !date.year) return 'Present';
  if (date.month && date.month > 0 && date.month <= 12) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.month - 1]} ${date.year}`;
  }
  return date.year.toString();
}

export function ProjectsCardSection({ projects }: ProjectsCardSectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-medium text-lg">
          <FolderOpen className="mr-2 h-4 w-4 text-primary" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </p>
                {project.description && (
                  <p className="text-sm text-muted-foreground">
                    {project.description}
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