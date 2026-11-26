import React from 'react';
import AccountPageLayout from './AccountPageLayout';

const HELP_TOPICS = [
  {
    title: 'Keyboard shortcuts',
    detail: 'Press Ctrl+K (or Cmd+K on Mac) to search books. Press Esc to close menus or return from sub-pages.',
  },
  {
    title: 'Accessible reader tools',
    detail: 'Open any book to switch fonts (Inter, OpenDyslexic, Lexend, Atkinson), adjust spacing, enable the reading ruler, or simplify dense paragraphs.',
  },
  {
    title: 'Voice Reader defaults',
    detail: 'Set your preferred voice and playback speed once in Settings. Voice Reader uses those defaults each time you listen.',
  },
  {
    title: 'Exporting your reading data',
    detail: 'Visit Settings -> Account -> Download to save a JSON copy of your profile, saved books, and highlights.',
  },
];

/**
 * Full-page Help view inside the shared 720px centered layout.
 */
export default function HelpPage({ onBack }) {
  return (
    <AccountPageLayout
      activePage="help"
      onBack={onBack}
      title="Help"
      subtitle="Quick answers for navigating and customizing NeuroRead."
    >
      <div className="border-t border-[#E4E4E7] divide-y divide-[#E4E4E7]">
        {HELP_TOPICS.map((topic) => (
          <section key={topic.title} className="py-6 space-y-1.5">
            <h2 className="text-base font-semibold text-[#141416]">{topic.title}</h2>
            <p className="text-sm text-[#524E48] leading-relaxed">{topic.detail}</p>
          </section>
        ))}
      </div>
    </AccountPageLayout>
  );
}
