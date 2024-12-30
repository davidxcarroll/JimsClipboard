import clipImage from '../assets/clip-305.png'

export function Settings() {
    return (
        <div className="
            flex flex-col gap-12 bg-white sm:px-8
            md:mt-0 sm:mt-0 xs:mt-20 mt-8
        ">

            <div className="
            relative z-10 flex items-center justify-center max-md:-mb-8
            lg:-mt-32 md:-mt-32 sm:-mt-28 xs:-mt-20 -mt-14
            ">
                <img
                    className="lg:w-[700px] sm:w-[600px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />
            </div>

            <div className="
              flex items-center justify-center marker pb-16
              lg:text-5xl md:text-4xl sm:text-3xl text-2xl
            ">
                Settings
            </div>

        </div>
    )
}