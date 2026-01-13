"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchResume } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { useResumeStore } from "@/lib/store/resume";
import { useAuthStore } from "@/lib/store/auth";
import { Resume } from "@/types/resume";

import EditorNav from "./_components/EditorNav";
import EditorForm from "./_components/EditorForm";
import EditorPreview from "./_components/EditorPreview";

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    // Global State
    const { isAuthenticated } = useAuthStore();
    const { resume, setResume, isLoading, isSaving } = useResumeStore();
    
    // UI State
    const [activeSection, setActiveSection] = useState<keyof Resume>("basics");

    // Auth Check
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    // Data Fetch
    useEffect(() => {
        const load = async () => {
            if (!isAuthenticated) return;
            try {
                const data = await fetchResume(id);
                setResume(data);
            } catch (error) {
                console.error(error);
                router.push("/dashboard");
            }
        };
        load();
    }, [id, isAuthenticated, router, setResume]);

    if (!isAuthenticated) return null;

    if (isLoading && !resume) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!resume) return null; // Should have redirected

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
                        {isSaving ? (
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
                        <EditorForm section={activeSection} />
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-1/2 border-l bg-slate-100 dark:bg-slate-900/50 p-4">
                    <EditorPreview />
                </div>
            </div>
        </div>
    );
}
