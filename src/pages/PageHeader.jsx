export default function PageHeader({ children, className }) {
  return (
    <section
      className={`w-full md:justify-items-left items-center relative flex my-0 mb-10 h-70 ${className}`}>
      <img
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-[.65] contrast-[1.1]"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
      />
      <div
        className={`absolute z-10 w-fit self-end top-[50%] grid px-5 lg:px-35 items-start ${className}`}>
        {children}
      </div>
    </section>
  );
}
