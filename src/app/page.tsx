import { TariffComparator } from '@/components/tariff-comparator';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background">
       <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 relative z-10">
        <TariffComparator />
      </main>
    </div>
  );
}
