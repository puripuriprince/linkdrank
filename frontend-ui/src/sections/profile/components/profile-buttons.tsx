import React from "react";
import { Profile } from "@/src/types/profile";
import {
  EducationDialog,
  ExperienceDialog,
  HonorsDialog,
  ProjectsDialog,
} from "./profile-dialogs";

export const ProfileButtons: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <>
      <ExperienceDialog experiences={profile.experiences} />
      <EducationDialog educations={profile.educations} />
      <ProjectsDialog projects={profile.projects} />
      <HonorsDialog honors={profile.honors} />
    </>
  );
};
