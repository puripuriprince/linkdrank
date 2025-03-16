import { CustomDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Education, Experience, Honor, Project } from "@/src/types/profile";

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
  experiences?: Experience[];
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
        <div key={index} className="border-b pb-2">
          <h2 className="text-lg font-semibold">{exp.title}</h2>
          <p className="text-sm text-gray-500">
            {exp.companyName} - {exp.location}
          </p>
          <p className="text-sm">
            {exp.startDate} - {exp.endDate} ({exp.duration})
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm">No experience information available.</p>
    )}
  </BaseDialog>
);

interface EducationDialogProps {
  educations?: Education[];
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
        <div key={index} className="border-b pb-2">
          <h2 className="text-lg font-semibold">{edu.school}</h2>
          <p className="text-sm text-gray-500">{edu.degree}</p>
          <p className="text-sm">
            {edu.startYear} - {edu.endYear}
          </p>
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
            {proj.startDate} - {proj.endDate}
          </p>
          <p className="text-sm">{proj.description}</p>
        </div>
      ))
    ) : (
      <p className="text-sm">No project information available.</p>
    )}
  </BaseDialog>
);

interface HonorsDialogProps {
  honors?: Honor[];
}

export const HonorsDialog: React.FC<HonorsDialogProps> = ({ honors }) => (
  <BaseDialog
    triggerText="Honors"
    triggerIcon="material-symbols:diamond-outline"
    title="Honors & Awards"
    description="View honors and awards"
  >
    {honors && honors.length > 0 ? (
      honors.map((honor, index) => (
        <div key={index} className="border-b pb-2">
          <h2 className="text-lg font-semibold">{honor.title}</h2>
          <p className="text-sm text-gray-500">{honor.issuer}</p>
        </div>
      ))
    ) : (
      <p className="text-sm">No honors information available.</p>
    )}
  </BaseDialog>
);
