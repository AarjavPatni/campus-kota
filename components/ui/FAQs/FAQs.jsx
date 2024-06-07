import LayoutEffect from "@/components/LayoutEffect"
import SectionWrapper from "@/components/SectionWrapper"

const faqsList = [
    {
        q: "Is there a curfew at the hostel?",
        a: "No, there is no curfew. Our hostel operates 24/7, allowing guests the flexibility to come and go as they please. However, we have 24/7 security to ensure the safety and security of all guests.",
    },
    {
        q: "How can I make a booking?",
        a: "Contact us via email or phone. To get in touch instantly, you can use the chat feature located at the bottom right corner of the website.",
    },
    {
        q: "Do you provide tours of the hostel?",
        a: "Yes, please get in touch through phone, email, or chat and we'd be happy to arrange a tour for you.",
    },
    {
        q: "What's the payment structure like?",
        a: "We require a deposit of ₹2000 to secure your booking. The remaining balance can be paid in full upon arrival. We accept cash, credit card, and bank transfer. The rent is due on the 1st of every month.",
    },
    {
        q: "When does the mess operate?",
        a: "The mess operates from 7:30 AM to 10:00 PM. We serve breakfast, lunch, and dinner everyday. You won't miss home-cooked meals, we promise!",
    },
    {
        q: "Is there a cancellation policy?",
        a: "Yes, we have a flexible cancellation policy. If you need to cancel your booking, please notify us at least 2 weeks before your scheduled move-in date to avoid any charges. For cancellations made less than 2 weeks in advance, a cancellation fee may apply.",
    },
]

const FAQs = () => (
    <SectionWrapper id="faqs">
        <div className="custom-screen text-gray-300">
            <div className="text-center xl:mx-auto">
                <h2 className="text-gray-50 text-3xl font-extrabold sm:text-4xl">
                    Everything you need to know
                </h2>
                <p className="mt-3">
                    Here are the most questions people always ask about.
                </p>
            </div>
            <div className='mt-12'>
                <LayoutEffect
                    className="duration-1000 delay-300"
                    isInviewState={{
                        trueState: "opacity-1",
                        falseState: "opacity-0 translate-y-12"
                    }}
                >
                    <ul className='space-y-8 gap-12 grid-cols-2 sm:grid sm:space-y-0 lg:grid-cols-3'>
                        {faqsList.map((item, idx) => (
                            <li
                                key={idx}
                                className="space-y-3"
                            >
                                <summary
                                    className="flex items-center justify-between font-semibold text-gray-100">
                                    {item.q}
                                </summary>
                                <p
                                    dangerouslySetInnerHTML={{ __html: item.a }}
                                    className='leading-relaxed'>
                                </p>
                            </li>
                        ))}
                    </ul>
                </LayoutEffect>
            </div>
        </div>
    </SectionWrapper>
)

export default FAQs