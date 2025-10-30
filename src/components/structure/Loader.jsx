export default function Loader() {
  return (
    <section className="w-screen h-screen flex items-center justify-center bg-white">
      <style>
        {`
          @keyframes changeHeight {
            0%, 100% { height: 10px; }
            50% { height: 50px; }
          }
        `}
      </style>

      <div className="flex gap-3 items-center h-10">
        <Expander delay="0s" />
        <Expander delay="0.2s" />
        <Expander delay="0.4s" />
				<Expander delay="0.6s" />
				<Expander delay="0.8s" />
      </div>
    </section>
  );
}

function Expander({ delay = "0s" }) {
  return (
    <div
      style={{ animationDelay: delay }}
      className="bg-primary-700 rounded-2xl w-5 h-[10px] animate-[changeHeight_1.4s_ease-in-out_infinite]"
    />
  );
}
