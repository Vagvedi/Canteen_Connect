export default function AuthLayout({ title, subtitle, children }) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1238] via-[#24164f] to-[#120a2a]">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center px-10">
  
          {/* LEFT */}
          <div className="text-white space-y-4">
            <h1 className="text-5xl font-extrabold">
              Canteen <span className="text-purple-400">Connect</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              {subtitle}
            </p>
          </div>
  
          {/* RIGHT CARD */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              {title}
            </h2>
            {children}
          </div>
  
        </div>
      </div>
    );
  }
  