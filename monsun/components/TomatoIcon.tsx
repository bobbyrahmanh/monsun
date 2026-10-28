// Ikon tomat (Pomodoro = "tomat" dalam bahasa Italia). Warnanya sengaja tetap merah di semua tema.
export default function TomatoIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <ellipse cx="16" cy="19.5" rx="12.5" ry="11" fill="#E5392B" />
      <path d="M8 15.5C9.6 12.8 12.4 11.4 15 11.2" stroke="#FF9A8B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M16 9 L18.6 11.6 L22.4 10.6 L20.6 14 L16 12.6 L11.4 14 L9.6 10.6 L13.4 11.6 Z" fill="#3E9B3E" />
      <path d="M16 10.2 V5.4" stroke="#2F7D32" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
