import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { CONFIG } from "@/global-config";

interface Education {
  id: number;
  userId: number;
  schoolId: number;
  degreeName: string;
  fieldOfStudy: string;
  startDate: { year: number };
  endDate: { year: number } | null;
  description?: string | null;
  school: {
    id: number;
    name: string;
    logoUrl?: string | null;
    linkedinUrl?: string | null;
  };
}

interface EducationCardSectionProps {
  educations: Education[];
}

export function EducationCardSection({ educations }: EducationCardSectionProps) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-medium text-lg">
          <GraduationCap className="mr-2 h-4 w-4 text-primary" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {educations.map((education) => (
            <div key={education.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-border/20">
                    <Image
                      src={education.school.logoUrl || `${CONFIG.assetsDir}/logo/logo.svg`}
                      alt={`${education.school.name} logo`}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {education.school.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {education.degreeName}
                    {education.fieldOfStudy && ` in ${education.fieldOfStudy}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {education.startDate.year} - {education.endDate?.year || 'Present'}
                  </p>
                  {education.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {education.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 