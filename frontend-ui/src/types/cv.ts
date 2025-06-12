import z from "zod";

export const BaseCertificationItemSchema = z.object({
	name: z.string(),
	dateGranted: z.string().optional(), // "April 2020" or "2020"
	link: z.string().optional(),
});

export const PersistentCertificationItemSchema =
	BaseCertificationItemSchema.extend({
		id: z.string(),
	});

    export const BaseEducationItemSchema = z.object({
        degree: z.string(),
        institution: z.string(),
        location: z.string().optional(),
        dateRangeFrom: z.string().optional(), // "April 2020" or "2020"
        dateRangeTo: z.string().optional(), // "May 2024" or "2024"
    });
    
    export const PersistentEducationItemSchema = BaseEducationItemSchema.extend({
        id: z.string(),
    });

    export const BaseExperienceItemSchema = z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        dateRangeFrom: z.string().optional(), // "April 2020" or "2020"
        dateRangeTo: z.string().optional(), // "May 2024" or "2024"
    });
    
    export const PersistentExperienceItemSchema = BaseExperienceItemSchema.extend({
        id: z.string(),
    
        bullets: z
            .array(
                z.object({
                    id: z.string(),
    
                    content: z.string(),
                }),
            )
            .optional(),
        techStack: z
            .array(
                z.object({
                    id: z.string(),
    
                    content: z.string(),
                }),
            )
            .optional(),
    });

    export const PersistentInterestItemSchema = z.object({
        id: z.string(),
    
        content: z.string(),
    });
    
    export const BaseProjectItemSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        link: z.string().optional(),
        dateRangeFrom: z.string().optional(), // "April 2020" or "2020"
        dateRangeTo: z.string().optional(), // "May 2024" or "2024"
    });
    
    export const PersistentProjectItemSchema = BaseProjectItemSchema.extend({
        id: z.string(),
    
        bullets: z
            .array(
                z.object({
                    id: z.string(),
    
                    content: z.string(),
                }),
            )
            .optional(),
        techStack: z
            .array(
                z.object({
                    id: z.string(),
    
                    content: z.string(),
                }),
            )
            .optional(),
    });

    export const PersistentSkillItemSchema = z.object({
        id: z.string(),
    
        content: z.string(),
    });
    
const BaseCurriculumVitaeSchema = z.object({
	fullName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	location: z.string().optional(),
	linkedInHandle: z.string().optional(),
	githubHandle: z.string().optional(),
	websiteUrl: z.string().optional(),
	summary: z.string().optional(),
});

export const PersistentCurriculumVitaeSchema = BaseCurriculumVitaeSchema.extend(
	{
		experience: z.array(PersistentExperienceItemSchema).optional(),
		education: z.array(PersistentEducationItemSchema).optional(),
		certifications: z.array(PersistentCertificationItemSchema).optional(),
		projects: z.array(PersistentProjectItemSchema).optional(),
		skills: z.array(PersistentSkillItemSchema).optional(),
		interests: z.array(PersistentInterestItemSchema).optional(),
	},
);


export type PersistentCurriculumVitae = z.infer<
	typeof PersistentCurriculumVitaeSchema
>;
