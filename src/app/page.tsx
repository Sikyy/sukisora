export default function Home() {
    return (
      <div className="min-h-screen ohmyking-red text-black overflow-hidden">
        {/* Top Navigation */}
        <header className="relative z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="text-black font-bold">
                <div className="text-sm">OhMyKing's</div>
                <div className="text-lg font-black">Space</div>
              </div>
            </div>
  
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#whoami" className="hover:underline">WHOAMI</a>
              <span>/</span>
              <a href="/works" className="hover:underline">WORK</a>
              <span>/</span>
              <a href="#contact" className="hover:underline">CONTACT</a>
            </nav>
  
            <div className="text-sm font-medium">@OhMyKing</div>
          </div>
  
          {/* Black divider */}
          <div className="h-6 bg-black"></div>
        </header>
  
        {/* Main Content Area */}
        <main className="relative">
          {/* Large Typography Section with Black Diagonal */}
          <section className="relative py-8 min-h-[500px]">
            {/* Black diagonal sections */}
            <div className="absolute top-0 left-0 w-full h-32 bg-black transform skew-y-1"></div>
            <div className="absolute bottom-0 right-0 w-4/5 h-48 bg-black transform -skew-y-2"></div>
  
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
                {/* Left side - Large Overlapping Typography */}
                <div className="relative overlapping-text pt-16">
                  <div className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight space-y-0">
                    <div className="relative">
                      <span className="text-black">Learner</span>
                    </div>
                    <div className="relative -mt-4">
                      <span className="text-black">Developer</span>
                    </div>
                    <div className="relative -mt-4">
                      <span className="text-black">Designer</span>
                    </div>
                    <div className="relative -mt-4">
                      <span className="text-black">Creator</span>
                    </div>
                    <div className="relative -mt-4">
                      <span className="text-black opacity-70">Learner</span>
                    </div>
                  </div>
  
                  {/* Overlapping background text */}
                  <div className="absolute top-20 left-8 text-6xl md:text-8xl font-black text-black opacity-20 select-none">
                    <div>Learner</div>
                    <div>Developer</div>
                    <div>Designer</div>
                    <div>Creator</div>
                    <div>Learner</div>
                  </div>
                </div>
  
                {/* Right side - Main Branding */}
                <div className="text-right pt-8">
                  <div className="text-white">
                    <div className="text-3xl md:text-5xl font-light">OhMyKing's</div>
                    <div className="text-6xl md:text-8xl lg:text-9xl font-black">SPACE</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Personal Description */}
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black mb-4">OhMyKing</h2>
                <p className="text-lg leading-relaxed">
                  BUPT student specializing in Agents Reinforcement Learning and LLM Safety
                </p>
                <p className="text-base leading-relaxed mt-4">
                  Communist Party member. Full-stack developer committed to advancing Artificial General Intelligence.
                  Co-founding AegisIntellect to advance AI safety technologies. Devoted to comprehensive excellence
                  and unwavering humanistic values. Passionate about all forms of beauty.
                </p>
              </div>
            </div>
          </section>
  
          {/* Three Sections */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* A Learner */}
                <div className="text-center">
                  <h3 className="text-3xl font-black mb-4">A Learner</h3>
                  <div className="mb-4 math-formula">
                    <div className="text-lg font-mono mb-1">f(x) = 0</div>
                    <div className="text-sm font-mono mb-2">x<sub>k+1</sub> = x<sub>k</sub> - f(x<sub>k</sub>)</div>
                    <div className="text-xs font-bold tracking-wider mb-3">GRADIENT DESCENT</div>
                    <div className="text-sm font-mono mb-1">min f(x)</div>
                    <div className="text-sm font-mono mb-2">s.t. g(x) ≤ 0</div>
                    <div className="text-xs font-bold tracking-wider mb-3">CONSTRAINED OPTIMIZATION</div>
                    <div className="text-sm font-mono mb-1">f(x) ≥ 0</div>
                    <div className="text-xs font-bold tracking-wider mb-3">CONVEXITY CONDITION</div>
                    <div className="text-sm font-mono mb-2">L(x,λ) = f(x) + λg(x)</div>
                    <div className="text-xs font-bold tracking-wider mb-3">LAGRANGIAN FUNCTION</div>
                    <div className="text-sm font-mono">||x<sub>k+1</sub> - x*||<sub>L</sub> ≤ ||x<sub>k</sub> - x*||</div>
                  </div>
                  <a href="#" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                    to my Blog
                  </a>
                  <div className="mt-4 text-sm font-bold">Knowledge is Virtue</div>
                </div>
  
                {/* A Designer */}
                <div className="text-center">
                  <h3 className="text-3xl font-black mb-4">A Designer</h3>
                  <div className="mb-4">
                    <p className="text-sm">Know a little about</p>
                    <p className="text-sm font-medium">Interaction design,</p>
                    <p className="text-sm font-medium">Graphic design,</p>
                    <p className="text-sm font-medium">3D design,</p>
                  </div>
                  <a href="#" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                    to my Blog
                  </a>
                  <div className="mt-4 text-sm font-bold">Beauty is Purpose</div>
                </div>
  
                {/* A Developer */}
                <div className="text-center">
                  <h3 className="text-3xl font-black mb-4">A Developer</h3>
                  <div className="mb-4">
                    <div className="text-sm font-bold">Creation is Vitality.</div>
                  </div>
                  <a href="#" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                    to my Blog
                  </a>
                  <div className="mt-4">
                    <div className="text-sm font-bold">Works</div>
                    <a href="/works" className="text-xs hover:underline">View My Works</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Contact Section */}
          <section id="contact" className="py-16 bg-black" style={{color: '#eb2c3c'}}>
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-black mb-8">CONTACT ME</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="font-bold">Phone</div>
                  <div>+86 18310619188</div>
                </div>
                <div>
                  <div className="font-bold">E-mail</div>
                  <div>quarkwang@bupt.edu.cn</div>
                </div>
                <div>
                  <div className="font-bold">WeChat</div>
                  <div>quarkwang0803</div>
                </div>
              </div>
              <div className="mt-8">
                <div className="text-xl font-bold">@OhMyKing</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
  