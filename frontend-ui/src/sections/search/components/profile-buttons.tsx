import React from "react";
import { ProfileWithRelations } from "@/lib/db/types";
import {
  EducationDialog,
  ExperienceDialog,
  AwardsDialog,
  ProjectsDialog,
} from "./profile-dialogs";

export const ProfileButtons: React.FC<{ profile: ProfileWithRelations }> = ({ profile }) => {
  return (
    <>
      <ExperienceDialog experiences={profile.experiences} />
      <EducationDialog educations={profile.educations} />
      <ProjectsDialog projects={profile.projects} />
      <AwardsDialog awards={profile.awards} />
    </>
  );
};
