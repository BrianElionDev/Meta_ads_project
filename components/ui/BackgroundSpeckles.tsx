export default function BackgroundSpeckles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-10 w-1 h-1 bg-white/10 rounded-full"></div>
      <div className="absolute top-40 right-20 w-0.5 h-0.5 bg-white/15 rounded-full"></div>
      <div className="absolute top-60 left-1/4 w-1 h-1 bg-white/8 rounded-full"></div>
      <div className="absolute top-80 right-1/3 w-0.5 h-0.5 bg-white/12 rounded-full"></div>
      <div className="absolute top-96 left-1/2 w-1 h-1 bg-white/6 rounded-full"></div>
      <div className="absolute top-32 right-1/4 w-0.5 h-0.5 bg-white/10 rounded-full"></div>
      <div className="absolute top-72 left-1/3 w-1 h-1 bg-white/8 rounded-full"></div>
    </div>
  );
}
