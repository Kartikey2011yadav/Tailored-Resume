"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Resume, Basics, Work, Education, Project, Skill } from "@/types/resume";
import { fetchResume, updateResume } from "@/lib/api";
import { debounce } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle"; 

// Sub-components (Inline for now, will extract later)
import EditorNav from "./_components/EditorNav";
import EditorForm from "./_components/EditorForm";
import EditorPreview from "./_components/EditorPreview";

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<keyof Resume>("basics");

    // Debounced Save
    const debouncedSave = useCallback(
        debounce(async (data: Partial<Resume>) => {
            setSaving(true);
            try {
                await updateResume(id, data);
            } catch (err) {
                console.error("Auto-save failed", err);
            } finally {
                setSaving(false);
            }
        }, 1000),
        [id]
    );

    useEffect(() => {
        loadResume();
    }, [id]);

    const loadResume = async () => {
        try {
            const data = await fetchResume(id);
            setResume(data);
        } catch (error) {
            console.error(error);
            alert("Failed to load resume");
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (section: keyof Resume, data: Resume[keyof Resume]) => {
        if (!resume) return;
        const updatedResume = { ...resume, [section]: data };
        setResume(updatedResume);
        debouncedSave({ [section]: data });
    };
    
    // Specific handlers for array updates (Work, Edu, etc.)
    // For simplicity, EditorForm will bubble up the entire section data

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!resume) return null;

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b px-6 py-3 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-semibold truncate max-w-md">{resume.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        {saving ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-3 h-3" /> Saved
                            </>
                        )}
                    </div>
                    <ThemeToggle />
                    {/* <Button size="sm">Download PDF</Button> */}
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Navigation (Sidebar) */}
                <div className="w-64 border-r bg-slate-50 dark:bg-slate-900 overflow-y-auto">
                    <EditorNav activeSection={activeSection} onSelect={(section: string) => setActiveSection(section as keyof Resume)} />
                </div>

                {/* Center: Form Editor */}
                <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-950">
                    <div className="max-w-2xl mx-auto">
                        <EditorForm 
                            section={activeSection} 
                            data={resume[activeSection]} 
                            onChange={(data: Resume[keyof Resume]) => handleUpdate(activeSection, data)}
                        />
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-1/2 border-l bg-slate-100 dark:bg-slate-900/50 p-4">
                    <EditorPreview resume={resume} />
                </div>
            </div>
        </div>
    );
}
