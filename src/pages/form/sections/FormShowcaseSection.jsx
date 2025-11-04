export default function FormShowcaseSection() {
  return (
    <section className="grid gap-5 w-full bg-neutral-200 p-5 lg:px-35">
      <div className="grid gap-1 justify-self-start justify-start">
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          Why join us?
        </h2>
      </div>
      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
        <FormShowcaseCard title="Impact Our Community Leaders and Underserved Families" />
        <FormShowcaseCard title="Access to Education Programs" />
        <FormShowcaseCard title="Exclusive Discounts at Businesses in the DFW Area" />
        <FormShowcaseCard title="Networking and Mentorship Opportunities"/>
				<FormShowcaseCard title="Empower Those Who Serve Our Communities"/>
				<FormShowcaseCard title="Invest in Sustainable Community Impact"/>
      </div>
    </section>
  );
}

function FormShowcaseCard({ title, src, alt }) {
  return (
    <article className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full aspect-square bg-accent-900 rounded-2xl border-4 border-neutral-300"
      />
			<div className="absolute flex bottom-0 p-5 px-10 h-1/4 w-full rounded-b-2xl border-x-4 border-b-4 border-neutral-300 bg-neutral-100 items-center justify-center">
				<h2 className="w-fit h-fit text-balance text-center text-md font-semibold">
					{title}
				</h2>
			</div>
    </article>
  );
}
