import { useEffect, useState } from "react";

export default function ExpressiveNumber({ start = 0, end, duration = 5000 }) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.pow(Math.E , Math.min((currentTime - startTime) / duration, 1));
      const currentValue = Math.round(start + (end - start) * progress);

      setValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return <p>{value}</p>;
}
