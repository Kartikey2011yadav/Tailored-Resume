import { Resume } from "@/types/resume";

const API_URL = "http://localhost:8000/api";

export async function fetchResumes(): Promise<Resume[]> {
  const res = await fetch(`${API_URL}/resumes/`);
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function createResume(title: string): Promise<Resume> {
  const res = await fetch(`${API_URL}/resumes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        title,
        basics: { name: "New User", email: "" } // Default minimal data
    }),
  });
  if (!res.ok) throw new Error("Failed to create resume");
  return res.json();
}

export async function deleteResume(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/resumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}

export async function duplicateResume(id: string): Promise<Resume> {
    // For now, complex duplication can be done client-side: Fetch -> Create with data
    // Or we extend the backend. Let's do client-side orchestration for MVP.
    const original = await fetchResume(id);
    const { id: _, ...data } = original; // Exclude ID
    const res = await fetch(`${API_URL}/resumes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, title: `${data.title} (Copy)` }),
    });
    if (!res.ok) throw new Error("Failed to duplicate resume");
    return res.json();
}

export async function fetchResume(id: string): Promise<Resume> {
  const res = await fetch(`${API_URL}/resumes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
    const res = await fetch(`${API_URL}/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update resume");
    return res.json();
  }
