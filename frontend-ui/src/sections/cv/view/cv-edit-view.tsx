import { PersistentCurriculumVitae } from "@/types/cv";
import { CVEditorForm } from "../components/cv-editor-form";

export function CVEditorView() {
    const cv = {} as PersistentCurriculumVitae;
    return (
<div className="flex flex-1 flex-col items-center justify-center">
				<CVEditorForm initialData={cv} />
			</div>
        )
    }