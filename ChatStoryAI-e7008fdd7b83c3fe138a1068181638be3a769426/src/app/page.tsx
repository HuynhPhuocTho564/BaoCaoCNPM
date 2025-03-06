import { Nav } from "@/components/nav/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
