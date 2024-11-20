import imgurl from "../assets/images/onboarding-img.png";
export default function Img()
{
    return(
        <>
        <section className="">
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
        <img
          alt=""
          src={imgurl}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="lg:py-24">
        <h2 className="text-3xl font-bold sm:text-4xl">Choose Better Health</h2>

        <p className="mt-4 text-gray-600">
        Online doctor consultation is the need of the hour today. The medicinal industry keeps on changing itself so that new treatment ways and new medications could be introduced. However, the present scenario of this industry is changing more than ever, because of the pandemic of course. So, to make medical facilities easily accessible to all, many companies, doctors, and hospitals tried their best to create an alternative so that patients can be assisted at home. Online doctor consultations are beneficial and creating significant changes in the lives of people.
        </p>

        <a
          href="#"
          className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Get Started Today
        </a>
      </div>
    </div>
  </div>
</section>
        </>
    )
}