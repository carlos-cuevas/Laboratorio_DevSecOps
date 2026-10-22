import { IToolSeoContent } from '@/common/interfaces';

export default function ToolSeoContent({
  title,
  content,
}: {
  title: string;
  content: IToolSeoContent;
}) {
  return (
    <section className='mt-12 border-t border-slate-200 dark:border-neutral-700 pt-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl'>
      <h2 className='text-lg font-bold text-foreground dark:text-foregroundDark mb-3'>
        About {title}
      </h2>
      {content.overview.map((paragraph, index) => (
        <p key={index} className='mb-3'>
          {paragraph}
        </p>
      ))}

      {content.features.length > 0 && (
        <>
          <h3 className='text-base font-semibold text-foreground dark:text-foregroundDark mt-6 mb-3'>
            Key Features
          </h3>
          <ul className='list-disc marker:text-emerald-500 pl-5 space-y-1.5 mb-6'>
            {content.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </>
      )}

      {content.faqs.length > 0 && (
        <>
          <h2 className='text-lg font-bold text-foreground dark:text-foregroundDark mt-8 mb-4'>
            Frequently Asked Questions
          </h2>
          {content.faqs.map((faq, index) => (
            <div key={index} className='mb-5'>
              <h3 className='text-base font-semibold text-foreground dark:text-foregroundDark mb-1'>
                {faq.question}
              </h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
