export default function Footer() {
  
  return (
    <footer className="relative min-h-[50vh] w-full bg-accent-background">
      <section className="absolute -top-[25%] inset-x-0 flex justify-center">
        <div className="w-[90%] md:w-[35%] rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-accent-identity p-5 text-center">
            <h2 className="text-lg hidden md:block text-white font-semibold">
              BE THE FIRST TO KNOW ABOUT UPCOMING EVENTS
            </h2>
            <h2 className="text-lg block md:hidden text-white font-semibold">
              GET UPDATES
            </h2>
          </div>
          <div className="bg-primary-background p-5 grid gap-5">
            <p>
              Join our family of supporters and receive inspiring stories, holistic wellness tips, and community updates right to your inbox.
            </p>
            <a className="bg-accent-identity p-5 text-primary-background rounded-2xl justify-self-start w-fit inline-flex">
              SUBSCRIBE
            </a>
            <p className="text-sm text-gray-500">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </footer>
  )
}