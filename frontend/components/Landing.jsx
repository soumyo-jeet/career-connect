// app/page.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Landing() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-background to-foreground/10">
            <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
                <div className="max-w-3xl space-y-8">
                    
                    <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-secondary via-yellow-500 to-primary animate-gradient bg-300% leading-tight">
                        Find Your Dream Job or Top Talent
                    </h1>
                    <p className="text-xl text-gray-600">
                        CareerConnect bridges the gap between employers and job seekers with
                        a seamless, modern platform.
                    </p>
                    <div className="flex gap-4 justify-center pt-6">
                        <Button
                            size="lg"
                            className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
                            asChild
                        >
                            <Link href="/dashboard">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>

                    </div>
                </div>
            </main>
        </div>
    );
}







