import { Nav } from "@/components/nav/nav"
import { Footer } from "@/components/footer"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 bg-background dark:bg-[#0B0C0F] flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  )
} 