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

  return (
    <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
      <div className="text-center bg-card/30 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-border/20">
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Days</div>
      </div>
      <div className="text-center bg-card/30 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-border/20">
        <div className="text-2xl md:text-3xl font-bold text-accent">
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Hours</div>
      </div>
      <div className="text-center bg-card/30 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-border/20">
        <div className="text-2xl md:text-3xl font-bold text-secondary">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Minutes</div>
      </div>
      <div className="text-center bg-card/30 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-border/20">
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Seconds</div>
      </div>
    </div>
  );
}
