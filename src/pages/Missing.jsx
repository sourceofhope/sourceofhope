export default function Missing() {
  return (
    <main className="w-screen min-h-screen flex justify-center items-center px-5">
      <section className="rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-accent-identity p-5 text-center">
          <h2 className="text-lg hidden md:block text-white font-semibold">
            404: Page Not Found
          </h2>
          <h2 className="text-lg block md:hidden text-white font-semibold">
            404
          </h2>
        </div>
        <div className="bg-primary-background p-5 grid gap-5 text-center">
          <p>Sorry, we couldn’t find the page you were looking for.</p>
          <a
            href="/"
            className="bg-accent-identity p-5 text-primary-background rounded-2xl justify-self-center w-fit inline-flex"
          >
            Go Home
          </a>
        </div>
      </section>
    </main>
  );
}
