export default function FormInputSection() {
  return (
    <form className="flex flex-wrap justify-between gap-y-5 p-5 lg:px-35">
      <FormInputItem title="First name" htmlFor="fname" type="text" />
      <FormInputItem title="Last Name" htmlFor="lname" type="text" />
      <FormInputItem title="E-mail Address" htmlFor="email" type="email" />
      <FormInputItem title="Phone Number" htmlFor="phone" type="tel" />
      <div className="flex flex-col gap-1 w-full md:w-[49%]">
        <label
          htmlFor="membership"
          className="text-sm md:text-md translate-3.5 md:translate-4 px-1 z-10 w-fit select-none after:content-[''] after:absolute after:left-0 after:top-[7px]
    after:block after:h-[5px] after:w-full font-semibold text-neutral-700
    after:bg-neutral-50 after:-z-10 after:pointer-events-none">
          Membership Type
        </label>
        <select
          name="membership"
          className="rounded-sm border-1 w-full h-[4ch] px-2 relative">
          <option value="empty"></option>
          <option value="bronze">Hope Advocate [Bronze Pin] ($50/month)</option>
          <option value="silver">
            Hope Professional [Silver Pin] ($199/month)
          </option>
          <option value="gold">
            Hope Enterprise Partner [Gold Pin] ($500/month)
          </option>
        </select>
      </div>
      <div className="flex flex-col gap-1 w-full md:w-[49%]">
        <label
          htmlFor="submit"
          className="text-sm md:text-md hidden md:block invisible select-none">
          Submit
        </label>
        <input
          name="submit"
          type="submit"
          value="Submit"
          className="rounded-sm w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
        />
      </div>
    </form>
  );
}

function FormInputItem({ title, htmlFor, type }) {
  return (
    <div className="flex flex-col gap-1 w-full md:w-[49%]">
      <label
        htmlFor={htmlFor}
        className="text-sm md:text-md translate-3.5 md:translate-4 px-1 z-10 w-fit select-none after:content-[''] after:absolute after:left-0 after:top-[7px]
    after:block after:h-[5px] after:w-full font-semibold
    after:bg-neutral-50 after:-z-10 after:pointer-events-none">
        {title}
      </label>
      <input
        name={htmlFor}
        type={type}
        className="rounded-sm border-1 w-full h-[4ch] px-2"
      />
    </div>
  );
}
