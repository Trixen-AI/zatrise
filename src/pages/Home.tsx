import { Community } from '@/components/sections/Community';
import { Core } from '@/components/sections/Core';
import { Features } from '@/components/sections/Features';
import { Footer } from '@/components/sections/Footer';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Stack } from '@/components/sections/Stack';
import { Tools } from '@/components/sections/Tools';
import { useSeo } from '@/lib/seo';

export default function Home() {
  useSeo({ path: '/' });
  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-x-hidden bg-bg">
      <Header />
      <main className="flex pt-[72px] lg:pt-[88px]">
        <div className="relative flex w-full flex-col lg:mt-[-88px]">
          <Hero />
          <Features />
          <Core />
          <Tools />
          <Stack />
          <Community />
        </div>
      </main>
      <Footer />
    </div>
  );
}
