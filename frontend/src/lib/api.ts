import { Resume } from "@/types/resume";
import { useAuthStore } from "./store/auth";

const API_URL = "http://localhost:8000/api";

// Helper to add auth header
async function authFetch(url: string, options: RequestInit = {}) {
    const token = useAuthStore.getState().token;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        useAuthStore.getState().logout();
        // optionally redirect to login
    }

    return res;
}

export async function login(email: string, password: string) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json(); // returns { access_token, token_type }
}

export async function register(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
    }
    return res.json();
}

export async function fetchResumes(): Promise<Resume[]> {
  const res = await authFetch("/resumes/");
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function createResume(title: string): Promise<Resume> {
  const res = await authFetch("/resumes/", {
    method: "POST",
    body: JSON.stringify({ 
        title,
        basics: { name: "New User", email: "" } 
    }),
  });
  if (!res.ok) throw new Error("Failed to create resume");
  return res.json();
}

export async function deleteResume(id: string): Promise<void> {
  const res = await authFetch(`/resumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}

export async function duplicateResume(id: string): Promise<Resume> {
    const original = await fetchResume(id);
    const { id: _, ...data } = original;
    const res = await authFetch("/resumes/", {
        method: "POST",
        body: JSON.stringify({ ...data, title: `${data.title} (Copy)` }),
    });
    if (!res.ok) throw new Error("Failed to duplicate resume");
    return res.json();
}

export async function fetchResume(id: string): Promise<Resume> {
  const res = await authFetch(`/resumes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
    const res = await authFetch(`/resumes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update resume");
    return res.json();
  }
