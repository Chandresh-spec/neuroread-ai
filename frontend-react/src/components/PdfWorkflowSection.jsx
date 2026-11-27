import React from 'react';
import { Upload } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Bring your own PDF',
    desc: 'Notes, articles or a book you already have.',
  },
  {
    num: '02',
    title: 'Make it comfortable',
    desc: 'Choose your text, spacing and page colour.',
  },
  {
    num: '03',
    title: 'Read. Listen. Pause.',
    desc: 'Find your rhythm and pick up where you left off.',
  },
];

export default function PdfWorkflowSection({ onUploadPdf }) {
  return (
    <section className="py-2">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#4B3AE8] block mb-2">
            YOUR FILES. YOUR READING STYLE.
          </span>
          <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#111115] tracking-[-0.02em]">
            From PDF to your kind of reading.
          </h2>
        </div>

        <button
          type="button"
          onClick={onUploadPdf}
          className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-xs active:scale-[0.98] whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          <span>Upload your PDF</span>
        </button>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {STEPS.map((step) => (
          <div
            key={step.num}
            onClick={onUploadPdf}
            className="bg-white hover:bg-[#FAF9FC] border border-[#EAE6F0] hover:border-[#CFC7DF] rounded-2xl p-5 sm:p-6 transition-all hover:shadow-sm cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#F1EEFC] text-[#4B3AE8] text-xs font-extrabold tabular-nums">
                {step.num}
              </span>
            </div>

            <h3 className="text-[15.5px] font-bold text-[#141416] group-hover:text-[#4B3AE8] transition-colors mb-1.5">
              {step.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#686472] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Upload CTA */}
      <div className="sm:hidden mt-5">
        <button
          type="button"
          onClick={onUploadPdf}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all shadow-sm active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload your PDF</span>
        </button>
      </div>
    </section>
  );
}
