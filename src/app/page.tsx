import { TariffComparator } from '@/components/tariff-comparator';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <TariffComparator />
      </main>
    </div>
  );
}
