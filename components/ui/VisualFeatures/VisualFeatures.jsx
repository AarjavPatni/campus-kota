import SectionWrapper from "@/components/SectionWrapper"
import Feature1 from "@/public/images/Feature-1.svg"
import Feature2 from "@/public/images/Feature-2.svg"
import Image from "next/image"

const VisualFeatures = () => {

    const features = [
        {
            title: "Proximity to Coaching Institutes",
            desc: "Name an institute and we're a stone's throw away. For anyone preparing for competitive exams, this is the place to be. 📚",
            img: Feature1
        },
        // {
        //     title: "Write your email content using AI",
        //     desc: "AI-powered email content writing is the perfect solution for busy professionals who need to quickly create engaging emails.",
        //     img: Feature2
        // },
    ]
    return (
        <SectionWrapper>
            <div className="custom-screen text-gray-300">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-gray-50 text-3xl font-semibold sm:text-4xl">
                        The Location Advantage
                    </h2>
                </div>
                <div className="mt-12">
                    <ul className="space-y-8 gap-x-6 sm:flex sm:space-y-0">
                        {
                            features.map((item, idx) => (
                                <li className="flex-1 flex flex-col justify-between border border-gray-800 rounded-2xl" key={idx}
                                    style={{
                                        background: "radial-gradient(141.61% 141.61% at 29.14% -11.49%, rgba(203, 213, 225, 0.15) 0%, rgba(203, 213, 225, 0) 57.72%)"
                                    }}
                                >
                                    <div className="p-8">
                                        <h3 className="text-gray-50 text-xl font-semibold">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 sm:text-sm md:text-base">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="pl-8">
                                        <Image
                                            src={item.img}
                                            className="w-full ml-auto h-4/5"
                                            alt={item.title}
                                        />
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </SectionWrapper>
    )
}

export default VisualFeatures