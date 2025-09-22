import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-10-16T10:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const boxStyle =
    "text-center bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-opacity-50";

  const neonText = (color: string) =>
    `text-3xl md:text-4xl font-bold text-[${color}] drop-shadow-[0_0_6px_${color}] drop-shadow-[0_0_12px_${color}]`;

  const labelStyle = "text-xs md:text-sm text-white/70";

  return (
    <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
      {/* Days */}
      <div className={`${boxStyle} border-[#ff00ff]`}>
        <div className={neonText("#ff00ff")}>
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <div className={labelStyle}>Days</div>
      </div>

      {/* Hours */}
      <div className={`${boxStyle} border-[#00ffff]`}>
        <div className={neonText("#00ffff")}>
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <div className={labelStyle}>Hours</div>
      </div>

      {/* Minutes */}
      <div className={`${boxStyle} border-[#ff66ff]`}>
        <div className={neonText("#ff66ff")}>
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <div className={labelStyle}>Minutes</div>
      </div>

      {/* Seconds */}
      <div className={`${boxStyle} border-[#ff00ff]`}>
        <div className={neonText("#ff00ff")}>
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <div className={labelStyle}>Seconds</div>
      </div>
    </div>
  );
}
