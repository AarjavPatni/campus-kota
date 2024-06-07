import Image from "next/image"

const Brand = ({ ...props }) => (
    <Image
        src="/header-logo.svg"
        alt="Campus Kota logo"
        {...props}
        width={110}
        height={50}
        priority
    />
)
export default Brand