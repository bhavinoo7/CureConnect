import imgurl from "../assets/images/onboarding-img.png";
export default function Image()
{
    return(<>
    <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt=""
            src={imgurl}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
    </>)
}