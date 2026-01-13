import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl mb-6">
          Tailored Resume
        </h1>
        <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 mb-10">
          Supercharge your job search. Use AI to tailor your master resume to any job description and generate a perfect LaTeX PDF in seconds.
        </p>
        <div className="flex justify-center gap-4">
            <Link href="/tailor">
                <Button size="lg" className="h-12 px-8 text-lg">
                    Start Tailoring
                </Button>
            </Link>
             <Link href="https://github.com/yourusername/tailored-resume">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    View on GitHub
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
