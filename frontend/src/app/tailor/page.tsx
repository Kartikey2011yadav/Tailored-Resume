"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Default placeholder for Master Resume
const DEFAULT_RESUME = {
  "basics": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "summary": "Experienced Software Engineer",
    "location": { "city": "San Francisco", "region": "CA" }
  },
  "work": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "startDate": "2020-01",
      "endDate": "Present",
      "highlights": ["Built amazing things", "Led a team"]
    }
  ],
  "education": [],
  "skills": [],
  "projects": [
      { "name": "Project A", "description": "A cool project", "highlights": ["Used React", "Used Python"] },
      { "name": "Project B", "description": "Another cool project", "highlights": ["Used AI"] },
      { "name": "Project C", "description": "Yet another project", "highlights": ["Used SQL"] },
      { "name": "Project D", "description": "Extra project", "highlights": ["Should be removed if limited"] }
  ]
};

export default function TailorPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeJson, setResumeJson] = useState(JSON.stringify(DEFAULT_RESUME, null, 2));
  const [tailoredResume, setTailoredResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleTailor = async () => {
    setLoading(true);
    setTailoredResume(null);
    try {
      let parsedResume;
      try {
        parsedResume = JSON.parse(resumeJson);
      } catch (e) {
        alert("Invalid JSON in Master Resume");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: parsedResume,
          job_description: jobDescription
        })
      });

      if (!res.ok) {
          const err = await res.json();
          alert(`Error: ${err.detail}`);
          return;
      }

      const data = await res.json();
      setTailoredResume(data);
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
      if (!tailoredResume) return;
      setGeneratingPdf(true);
      try {
          const res = await fetch("http://localhost:8000/api/generate-pdf", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(tailoredResume)
          });
          
          if (!res.ok) {
              const err = await res.json();
              alert(`Error: ${err.detail}`);
              return;
          }
          
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "resume.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
      } catch (e) {
          console.error(e);
          alert("Failed to generate PDF");
      } finally {
          setGeneratingPdf(false);
      }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Tailor Workspace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the job description you are targeting.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste Job Description here..." 
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Master Resume (JSON)</CardTitle>
              <CardDescription>Your full resume data in JSON format.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[300px] font-mono text-sm"
                value={resumeJson}
                onChange={(e) => setResumeJson(e.target.value)}
              />
            </CardContent>
            <CardFooter>
                 <Button onClick={handleTailor} disabled={loading || !jobDescription} className="w-full">
                    {loading ? "Tailoring..." : "Tailor Resume"}
                 </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-6">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Tailored Result</CardTitle>
                    <CardDescription>Review the AI-optimized JSON before generating PDF.</CardDescription>
                </CardHeader>
                <CardContent className="grow">
                    {tailoredResume ? (
                        <div className="h-full flex flex-col gap-4">
                            <Textarea 
                                className="grow font-mono text-sm min-h-[400px]"
                                value={JSON.stringify(tailoredResume, null, 2)}
                                readOnly
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 border-2 border-dashed rounded-lg">
                            Tailored output will appear here
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button 
                        onClick={handleGeneratePdf} 
                        disabled={!tailoredResume || generatingPdf} 
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {generatingPdf ? "Compiling PDF..." : "Generate PDF"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
