import { ArrowLeftIcon as ArrowLeft } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Footer } from '@/components/footer';

export function StaticPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background overflow-x-hidden">
      <div className="absolute -top-1/4 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[150px] opacity-40 animate-pulse-slow [animation-delay:-4s]"></div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <main className="container mx-auto flex-grow flex-col items-center justify-start px-4 py-16 sm:px-6 sm:py-24 relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al comparador
          </Link>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">
            {title}
          </h1>
          <article className="prose prose-invert prose-lg max-w-none text-muted-foreground prose-h2:text-foreground prose-h2:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
            {children}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
