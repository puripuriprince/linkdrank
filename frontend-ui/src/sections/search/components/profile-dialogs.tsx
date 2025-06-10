import { CustomDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Education, Experience, Award, Project } from "@/lib/db/types";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

interface BaseDialogProps {
  triggerText: string;
  triggerIcon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  triggerText,
  triggerIcon,
  title,
  description,
  children,
}) => {
  return (
    <CustomDialog
      trigger={
        <Button variant="outline" size="sm">
          <Icon icon={triggerIcon} width="16" height="16" /> {triggerText}
        </Button>
      }
      title={title}
      description={description}
    >
      <div className="space-y-4 max-h-80 overflow-y-auto">{children}</div>
    </CustomDialog>
  );
};

interface ExperienceDialogProps {
  experiences?: (Experience & { organization: { name: string; logoUrl?: string | null } })[];
}

export const ExperienceDialog: React.FC<ExperienceDialogProps> = ({
  experiences,
}) => (
  <BaseDialog
    triggerText="Experience"
    triggerIcon="material-symbols:work"
    title="Experience"
    description="View professional experience details"
  >
    {experiences && experiences.length > 0 ? (
      experiences.map((exp, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={exp.organization.logoUrl || undefined} alt={exp.organization.name} />
              <AvatarFallback>{exp.organization.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div key={index} className="border-b pb-2">
            <h2 className="text-lg font-semibold">{exp.title}</h2>
            <p className="text-sm text-gray-500">
              {exp.organization.name}
            </p>
            <p className="text-sm">
              {exp.startDate ? `${exp.startDate.month || ''}/${exp.startDate.year}` : ''} - {exp.endDate ? `${exp.endDate.month || ''}/${exp.endDate.year}` : 'Present'}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm">No experience information available.</p>
    )}
  </BaseDialog>
);

interface EducationDialogProps {
  educations?: (Education & { school: { name: string; logoUrl?: string | null } })[];
}

export const EducationDialog: React.FC<EducationDialogProps> = ({
  educations,
}) => (
  <BaseDialog
    triggerText="Education"
    triggerIcon="material-symbols:school"
    title="Education"
    description="View educational background"
  >
    {educations && educations.length > 0 ? (
      educations.map((edu, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={edu.school.logoUrl || undefined} alt={edu.school.name} />
              <AvatarFallback>{edu.school.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div key={index} className="border-b pb-2">
            <h2 className="text-lg font-semibold">{edu.school.name}</h2>
            <p className="text-sm text-gray-500">{edu.degreeName}</p>
            <p className="text-sm">
              {edu.startDate?.year} - {edu.endDate?.year || 'Present'}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm">No education information available.</p>
    )}
  </BaseDialog>
);

interface ProjectsDialogProps {
  projects?: Project[];
}

export const ProjectsDialog: React.FC<ProjectsDialogProps> = ({ projects }) => (
  <BaseDialog
    triggerText="Projects"
    triggerIcon="hugeicons:workflow-circle-05"
    title="Projects"
    description="View project details"
  >
    {projects && projects.length > 0 ? (
      projects.map((proj, index) => (
        <div key={index} className="border-b pb-2">
          <h2 className="text-lg font-semibold">{proj.title}</h2>
          <p className="text-sm text-gray-500">
            {`
            ${proj.startDate ? `${proj.startDate.month || ''}/${proj.startDate.year}` : ""}
            ${proj.endDate ? " - " + `${proj.endDate.month || ''}/${proj.endDate.year}` : ""}
            `}
          </p>
          {proj.description && (
            <ul>
              {proj.description.split("- ").map((line, index) => (
                <li key={index} className="text-sm mb-2">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm">No project information available.</p>
    )}
  </BaseDialog>
);

interface AwardsDialogProps {
  awards?: Award[];
}

export const AwardsDialog: React.FC<AwardsDialogProps> = ({ awards }) => (
  <BaseDialog
    triggerText="Awards"
    triggerIcon="material-symbols:diamond-outline"
    title="Awards & Honors"
    description="View awards and honors"
  >
    {awards && awards.length > 0 ? (
      awards.map((award, index) => (
        <div key={index} className="border-b pb-2">
          <h2 className="text-lg font-semibold">{award.title}</h2>
          <p className="text-sm text-gray-500">{award.issuer}</p>
          {award.awardDate && (
            <p className="text-sm text-gray-400">
              {award.awardDate.month ? `${award.awardDate.month}/` : ''}{award.awardDate.year}
            </p>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm">No awards information available.</p>
    )}
  </BaseDialog>
);
