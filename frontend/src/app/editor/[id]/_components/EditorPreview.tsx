"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/lib/store/resume";
import { Loader2 } from "lucide-react";

export default function EditorPreview() {
    const resume = useResumeStore((state) => state.resume);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resume) return;

        const generatePdf = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8000/api/generate-pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(resume),
                });
                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                }
            } catch (error) {
                console.error("PDF Gen failed", error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            generatePdf();
        }, 1500); // 1.5s debounce for preview generation

        return () => clearTimeout(timeout);
    }, [resume]);

    if (!resume) return <div className="h-full flex items-center justify-center text-slate-400">No content</div>;

    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-950 rounded-lg overflow-hidden relative shadow-inner">
            {loading && (
                <div className="absolute top-4 right-4 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
            )}
            
            {pdfUrl ? (
                <iframe 
                    src={`${pdfUrl}#toolbar=0&navpanes=0`} 
                    className="w-full h-full border-none"
                    title="Resume Preview"
                />
            ) : (
                <div className="text-slate-400">Loading Preview...</div>
            )}
        </div>
    );
}
