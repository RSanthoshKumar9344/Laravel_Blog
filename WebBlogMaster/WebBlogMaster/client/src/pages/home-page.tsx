import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Our Blog Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Share your thoughts, connect with others, and explore interesting
            stories from our community of writers and thinkers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/blog">
              <Button size="lg">View Blog Posts</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
