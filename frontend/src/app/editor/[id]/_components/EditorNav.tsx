import { User, Briefcase, GraduationCap, Code, Rocket, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
    { id: "basics", label: "Basics", icon: User },
    { id: "work", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Rocket },
    { id: "resume_metadata", label: "Settings", icon: Settings },
];

interface EditorNavProps {
    activeSection: string;
    onSelect: (id: string) => void;
}

export default function EditorNav({ activeSection, onSelect }: EditorNavProps) {
    return (
        <nav className="p-4 space-y-2">
            {SECTIONS.map((item) => (
                <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelect(item.id)}
                >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                </Button>
            ))}
        </nav>
    );
}
