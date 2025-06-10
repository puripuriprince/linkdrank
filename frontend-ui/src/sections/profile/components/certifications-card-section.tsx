import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";

interface Certification {
  id: number;
  userId: number;
  name: string;
  authority: string;
  displaySource: string;
  licenseNumber?: string | null;
  url?: string | null;
  startDate: { year: number; month?: number };
  endDate: { year: number; month?: number } | null;
}

interface CertificationsCardSectionProps {
  certifications: Certification[];
}

function formatCertDate(date: { year: number; month?: number } | null): string {
  if (!date) return '';
  if (date.month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.month - 1]} ${date.year}`;
  }
  return date.year.toString();
}

export function CertificationsCardSection({ certifications }: CertificationsCardSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-medium text-lg">
          <Award className="mr-2 h-4 w-4 text-primary" />
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">
                    {cert.name}
                  </h3>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {cert.authority}
                </p>
                <p className="text-xs text-muted-foreground">
                  Issued {formatCertDate(cert.startDate)}
                  {cert.endDate && ` • Expires ${formatCertDate(cert.endDate)}`}
                </p>
                {cert.licenseNumber && (
                  <p className="text-xs text-muted-foreground">
                    License: {cert.licenseNumber}
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