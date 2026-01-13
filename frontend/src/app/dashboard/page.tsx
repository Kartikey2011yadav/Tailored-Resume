"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Copy, FileText, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchResumes, createResume, deleteResume, duplicateResume } from "@/lib/api";
import { Resume } from "@/types/resume";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/lib/store/auth";

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuthStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        loadResumes();
    }, [isAuthenticated, router]);

    const loadResumes = async () => {
        try {
            const data = await fetchResumes();
            setResumes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setActionLoading("create");
        try {
            const newResume = await createResume("Untitled Resume");
            setResumes([...resumes, newResume]);
            router.push(`/editor/${newResume.id}`);
        } catch (error) {
            alert("Failed to create resume");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        if (!confirm("Are you sure you want to delete this resume?")) return;
        
        setActionLoading(id);
        try {
            await deleteResume(id);
            setResumes(resumes.filter(r => r.id !== id));
        } catch (error) {
            alert("Failed to delete resume");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDuplicate = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setActionLoading(id);
        try {
            const newResume = await duplicateResume(id);
            setResumes([...resumes, newResume]);
        } catch (error) {
            alert("Failed to duplicate resume");
        } finally {
            setActionLoading(null);
        }
    };
    
    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) return null; // Avoid flashing content before redirect

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Your Resumes</h1>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="outline" size="icon" onClick={handleLogout} title="Sign Out">
                        <LogOut className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleCreate} disabled={!!actionLoading}>
                        {actionLoading === "create" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                </div>
            </div>

            {resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <FileText className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">No resumes yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm text-center">
                        Create your first resume to start tailoring it for jobs.
                    </p>
                    <Button onClick={handleCreate} disabled={!!actionLoading}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Resume
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                        <Link href={`/editor/${resume.id}`} key={resume.id} className="block group">
                            <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                                <CardHeader>
                                    <CardTitle className="truncate pr-4">{resume.title}</CardTitle>
                                    <CardDescription>
                                        Updated {new Date(resume.updated_at || Date.now()).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <div className="px-6 pb-2">
                                     {/* Preview Thumbnail Placeholder */}
                                    <div className="aspect-[210/297] bg-slate-100 dark:bg-slate-800 rounded-md mb-4 flex items-center justify-center text-xs text-slate-400">
                                        Preview
                                    </div>
                                </div>
                                <CardFooter className="flex justify-between border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                     <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={(e) => handleDuplicate(resume.id!, e)}
                                        disabled={actionLoading === resume.id}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicate
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={(e) => handleDelete(resume.id!, e)}
                                        disabled={actionLoading === resume.id}
                                    >
                                        {actionLoading === resume.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
