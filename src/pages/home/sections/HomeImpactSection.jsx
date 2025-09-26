import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import ExpressiveNumber from "../../../components/ui/expressive/ExpressiveNumber";
import { DefaultGenerator } from "../../../components/ui/expressive/DefaultGenerator";

export default function HomeImpactSection() {
  return (
    <section
      className={`my-5 py-5 px-5 lg:px-35 w-full h-full justify-items-center items-center grid gap-5 bg-accent-800 text-neutral-50`}
    >
      <div className="grid grid-flow-row w-full md:grid-cols-[1fr_1fr] items-center gap-5">
        <article className="flex flex-col gap-5 w-full justify-center items-center">
          <h2 className="text-xlg font-semibold font-urbanist">Our Impact</h2>
          <p className="text-neutral-400 text-center">
            Real Results and Powerful Change in Our Community
          </p>
          <ImpactNumber end={16} caption="Years of Service" post="+" />
          <ImpactNumber
            end={900}
            caption="Holistic Wellness Aid Given"
            pre="$"
            post="K"
          />
          <ImpactNumber end={353} caption="Free Meals Served" post="K" />
          <ImpactNumber
            end={500}
            caption="Donations Received"
            pre="$"
            post="K"
          />
          <ImpactNumber
            end={273}
            caption="Total Volunteer Hours Served"
            pre="$"
            post="K"
          />
        </article>
        <article className="flex md:border-l-2 w-full md:border-neutral-500 justify-center">
          <video
            controls={false}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="w-[500px] aspect-square bg-accent-900 rounded-2xl object-center object-cover"
          >
            <source
              src="https://static.vecteezy.com/system/resources/previews/041/753/968/mp4/time-lapse-sayans-foggy-mountains-of-russia-free-video.mp4"
              type="video/mp4"
            />
          </video>
        </article>
      </div>
      <button className="justify-self-end md:justify-self-start w-fit text-neutral-400">
        <ExpressiveLink className="text-sm" to="">
          LEARN MORE
        </ExpressiveLink>
      </button>
    </section>
  );
}

function ImpactNumber({ end, caption, pre = "", post = "" }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <strong className="flex items-center gap-1">
        {pre}
        <ExpressiveNumber
          className="text-xxlg font-semibold"
          start={1}
          end={end}
          generator={DefaultGenerator.EASE_IN_OUT}
        />
        {post}
      </strong>
      <p className="border-b-2 pb-2 border-neutral-500">{caption}</p>
    </div>
  );
}
