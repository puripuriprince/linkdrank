"use server";

import { PersistentCurriculumVitae, PersistentCurriculumVitaeSchema } from "@/types/cv";

export type UpdateCurriculumVitaeActionState =
	| {
			ok: false;
			error: string;
	  }
	| {
			ok: true;
			curriculumVitae: PersistentCurriculumVitae;
			updatedAt: string; // ISO string
	  };

export async function updateCurriculumVitaeAction(
	currentState: UpdateCurriculumVitaeActionState | undefined,
	formData: FormData,
): Promise<UpdateCurriculumVitaeActionState> {
	try {
		const curriculumVitaeResult = PersistentCurriculumVitaeSchema.safeParse(
			JSON.parse(formData.get("curriculumVitae") as string),
		);

		if (!curriculumVitaeResult.success) {
			console.error("Invalid curriculum vitae", curriculumVitaeResult.error);
			return { ok: false, error: "Invalid curriculum vitae" };
		}

		return {
			ok: true,
			curriculumVitae: curriculumVitaeResult.data,
			updatedAt: new Date().toISOString(),
		};
	} catch (error) {
		console.error("Error updating curriculum vitae:", error);
		return { ok: false, error: "Failed to update curriculum vitae" };
	}
}
