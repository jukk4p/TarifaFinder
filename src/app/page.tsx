import { LanguageSwitcher } from '@/components/language-switcher';
import { TariffComparator } from '@/components/tariff-comparator';
import { TariffDataViewer } from '@/components/tariff-data-viewer';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background overflow-x-hidden">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <div className="absolute -top-1/4 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[150px] opacity-40 animate-pulse-slow [animation-delay:-4s]"></div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <main className="container mx-auto flex flex-grow flex-col items-center justify-center p-4 relative z-10">
        <TariffComparator />
        <TariffDataViewer />
      </main>

    </div>
  );
}
