import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Resume, Basics, Work, Metadata } from "@/types/resume";

interface EditorFormProps {
    section: keyof Resume;
    data: Resume[keyof Resume];
    onChange: (data: Resume[keyof Resume]) => void;
}

// Temporary Inline Forms - Will replace with robust components later
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ... BasicsForm ...
const BasicsForm = ({ data, onChange }: { data: Basics, onChange: (d: Basics) => void }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={data?.name || ""} onChange={e => onChange({ ...data, name: e.target.value })} />
            </div>
            <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={data?.label || ""} onChange={e => onChange({ ...data, label: e.target.value })} />
            </div>
        </div>
        <div className="space-y-2">
            <Label>Email</Label>
            <Input value={data?.email || ""} onChange={e => onChange({ ...data, email: e.target.value })} />
        </div>
        <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={data?.phone || ""} onChange={e => onChange({ ...data, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea className="h-32" value={data?.summary || ""} onChange={e => onChange({ ...data, summary: e.target.value })} />
        </div>
    </div>
);

const WorkForm = ({ data, onChange }: { data: Work[], onChange: (d: Work[]) => void }) => {
    const addFn = () => onChange([...data, { company: "New Company", position: "Role", startDate: "", endDate: "" }]);
    const updateFn = <K extends keyof Work>(index: number, field: K, value: Work[K]) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };
    const removeFn = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {data.map((item, index) => (
                <Card key={index} className="relative group">
                    <CardContent className="p-4 space-y-4">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeFn(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input value={item.company || ""} onChange={e => updateFn(index, "company", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Input value={item.position || ""} onChange={e => updateFn(index, "position", e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input value={item.startDate || ""} onChange={e => updateFn(index, "startDate", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input value={item.endDate || ""} onChange={e => updateFn(index, "endDate", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea className="min-h-[100px]" value={item.summary || ""} onChange={e => updateFn(index, "summary", e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button onClick={addFn} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
            </Button>
        </div>
    );
};

const SettingsForm = ({ data, onChange }: { data: Metadata, onChange: (d: Metadata) => void }) => {
    // Ensure metadata structure exists
    const metadata = data || { template: "resume", theme: { primary: "#000000" } };
    
    const updateTemplate = (tpl: string) => {
        onChange({ ...metadata, template: tpl });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Resume Settings</h3>
            
            <div className="space-y-4">
                <Label>Template Design</Label>
                <div className="grid grid-cols-3 gap-4">
                    {["resume", "modern", "classic"].map((tpl) => (
                        <div 
                            key={tpl}
                            onClick={() => updateTemplate(tpl)}
                            className={`
                                cursor-pointer border-2 rounded-lg p-4 text-center capitalize hover:border-primary/50 transition-all
                                ${metadata.template === tpl ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 dark:border-slate-800"}
                            `}
                        >
                            <div className="w-full aspect-[210/297] bg-slate-100 dark:bg-slate-800 mb-2 rounded border border-slate-200 dark:border-slate-700"></div>
                            {tpl}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function EditorForm({ section, data, onChange }: EditorFormProps) {
    if (section === "basics") {
        return <BasicsForm data={data as Basics} onChange={onChange as (d: Basics) => void} />;
    }
    if (section === "work") {
        return <WorkForm data={data as Work[]} onChange={onChange as (d: Work[]) => void} />;
    }
    if (section === "resume_metadata") {
        return <SettingsForm data={data as Metadata} onChange={onChange as (d: Metadata) => void} />;
    }

    return (
        <div className="p-10 text-center text-slate-500">
            <p>Form for <strong>{section}</strong> is under construction.</p>
        </div>
    );
}
