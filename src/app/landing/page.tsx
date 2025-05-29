// npm install framer-motion

// app/page.tsx or wherever your landing content is
import AnimationLanding from './aniLanding';

export default function LandingPage() {
  return (
    <main className="relative h-screen overflow-hidden">
      <h1 className="text-4xl text-center mt-20 z-10 relative">Welcome!</h1>
      <AnimationLanding />
    </main>
  );
}
