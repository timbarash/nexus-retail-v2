import React, { useMemo } from 'react';

const COLORS = [
  'text-[#00C27C]',
  'text-[#64A8E0]',
  'text-[#D4A03A]',
  'text-[#00E08E]',
  'text-[#B598E8]',
  'text-[#F0EDE8]',
  'text-[#E87068]',
  'text-[#79C0FF]',
  'text-[#7EE787]',
  'text-[#FFA657]',
];

export default function WordCloud({ words = [], maxWords = 40 }) {
  const displayWords = useMemo(() => {
    if (!words || words.length === 0) return [];

    const sorted = [...words]
      .sort((a, b) => b.value - a.value)
      .slice(0, maxWords);

    if (sorted.length === 0) return [];

    const maxVal = sorted[0].value;
    const minVal = sorted[sorted.length - 1].value;
    const range = maxVal - minVal || 1;

    return sorted.map((word, i) => {
      const normalized = (word.value - minVal) / range;
      const fontSize = 0.75 + normalized * 1.75;
      const fontWeight = normalized > 0.6 ? 700 : normalized > 0.3 ? 600 : 400;
      const opacity = 0.6 + normalized * 0.4;
      const colorClass = COLORS[i % COLORS.length];

      return {
        ...word,
        fontSize,
        fontWeight,
        opacity,
        colorClass,
      };
    });
  }, [words, maxWords]);

  const shuffled = useMemo(() => {
    const arr = [...displayWords];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [displayWords]);

  if (shuffled.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6B6359] text-sm">
        No word data available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 p-4">
      {shuffled.map((word) => (
        <span
          key={word.text}
          className={`inline-block cursor-default transition-transform duration-200 hover:scale-110 ${word.colorClass}`}
          style={{
            fontSize: `${word.fontSize}rem`,
            fontWeight: word.fontWeight,
            opacity: word.opacity,
            lineHeight: 1.2,
          }}
          title={`${word.text}: ${word.value} mentions`}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}
