"use client";

import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";

import { useState } from "react";


import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersistentCurriculumVitae } from "@/types/cv";
import { nanoid } from "@/lib/utils/nanoid";

interface SkillsSectionProps {
	skills: NonNullable<PersistentCurriculumVitae["skills"]>;
	onUpdate: (skills: NonNullable<PersistentCurriculumVitae["skills"]>) => void;
}

interface SortableSkillItemProps {
	skill: NonNullable<PersistentCurriculumVitae["skills"]>[number];
	onUpdate: (field: string, value: string) => void;
	onRemove: () => void;
}

function SortableSkillItem({
	skill,
	onUpdate,
	onRemove,
}: SortableSkillItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: skill.id,
		transition: {
			duration: 250,
			easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? "none" : transition,
		zIndex: isDragging ? 9999 : "auto",
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative flex items-center gap-1 rounded-full border bg-muted/30 px-3 py-1.5 text-sm transition-all duration-200",
				isDragging && "opacity-30 shadow-lg",
			)}
		>
			{/* Drag Handle */}
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab opacity-40 hover:opacity-70 active:cursor-grabbing"
			>
				<GripVertical className="h-3 w-3 text-muted-foreground" />
			</div>

			{/* Content */}
			<Input
				value={skill.content}
				onChange={(e) => onUpdate("content", e.target.value)}
				className="h-auto min-h-0 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
				placeholder="Skill"
			/>

			{/* Remove button */}
			<Button
				onClick={onRemove}
				variant="ghost"
				size="sm"
				className="h-4 w-4 p-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
			>
				<X className="h-3 w-3" />
			</Button>
		</div>
	);
}

export function SkillsSection({ skills, onUpdate }: SkillsSectionProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = skills.findIndex((item) => item.id === active.id);
		const newIndex = skills.findIndex((item) => item.id === over.id);
		const reordered = arrayMove(skills, oldIndex, newIndex);
		onUpdate(reordered);
	};

	const addSkill = () => {
		const newSkill = {
			id: nanoid(),
			content: "",
		} satisfies NonNullable<PersistentCurriculumVitae["skills"]>[number];
		onUpdate([...skills, newSkill]);
	};

	const updateSkill = (id: string, field: string, value: string) => {
		const updated = skills.map((skill) =>
			skill.id === id ? { ...skill, [field]: value } : skill,
		);
		onUpdate(updated);
	};

	const removeSkill = (id: string) => {
		const updated = skills.filter((skill) => skill.id !== id);
		onUpdate(updated);
	};

	const activeItem = skills.find((item) => item.id === activeId);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="flex-1 border-border border-b pb-1 font-semibold text-lg">
					SKILLS
				</h2>
				<Button
					onClick={addSkill}
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-foreground"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={skills.map((skill) => skill.id)}
					strategy={horizontalListSortingStrategy}
				>
					<div
						className={cn(
							"grid min-h-[60px] grid-cols-2 gap-2 border border-transparent p-2 transition-all duration-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
						)}
					>
						{skills.map((skill) => (
							<SortableSkillItem
								key={skill.id}
								skill={skill}
								onUpdate={(field, value) => updateSkill(skill.id, field, value)}
								onRemove={() => removeSkill(skill.id)}
							/>
						))}

						{skills.length === 0 && (
							<div className="col-span-2 flex h-16 w-full items-center justify-center rounded border-2 border-muted border-dashed text-base text-muted-foreground sm:col-span-2 md:col-span-3 lg:col-span-4">
								No skills yet. Click + to add one.
							</div>
						)}
					</div>
				</SortableContext>

				<DragOverlay
					adjustScale={false}
					dropAnimation={{
						duration: 250,
						easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
					}}
				>
					{activeItem ? (
						<SortableSkillItem
							skill={activeItem}
							onUpdate={() => {}} // No-op for overlay
							onRemove={() => {}} // No-op for overlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
