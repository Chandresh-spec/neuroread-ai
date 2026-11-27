import React from 'react';
import { Upload } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Bring your own PDF',
    description: 'Notes, articles or a book you already have.',
  },
  {
    number: '02',
    title: 'Make it comfortable',
    description: 'Choose your text, spacing and page colour.',
  },
  {
    number: '03',
    title: 'Read. Listen. Pause.',
    description: 'Find your rhythm and pick up where you left off.',
  },
];

export default function PdfWorkflowSection({ onUploadPdf }) {
  return (
    <section aria-labelledby="home-workflow-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#3B2FD6] block mb-2">
            YOUR FILES. YOUR READING STYLE.
          </span>
          <h2
            id="home-workflow-heading"
            className="text-2xl sm:text-[28px] font-bold text-[#141416] tracking-tight leading-tight"
          >
            From PDF to your kind of reading.
          </h2>
        </div>

        <button
          type="button"
          onClick={onUploadPdf}
          className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#3B2FD6] hover:bg-[#3125BE] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          <span>Upload your PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-[#E8E4DC] rounded-2xl p-5 flex items-start gap-3.5"
          >
            <span className="px-2 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B2FD6] text-[11px] font-bold tabular-nums flex-shrink-0 mt-0.5">
              {step.number}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-[#141416] leading-snug">
                {step.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5A5864] mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:hidden mt-4">
        <button
          type="button"
          onClick={onUploadPdf}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#3B2FD6] hover:bg-[#3125BE] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2FD6]"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          <span>Upload your PDF</span>
        </button>
      </div>
    </section>
  );
}
