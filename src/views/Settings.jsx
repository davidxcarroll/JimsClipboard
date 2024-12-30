import clipImage from '../assets/clip-305.png'

export function Settings() {
    return (
        <div className="
        flex flex-col bg-neutral-100 pb-32
        ">

            <div className="
            relative z-10 flex items-center justify-center
            lg:-mt-28 md:-mt-24 sm:-mt-20 xs:-mt-20 -mt-14
            ">
                <img
                    className="lg:w-[700px] md:w-[600px] w-[450px] min-w-[400px] h-auto"
                    src={clipImage}
                    alt="Clipboard"
                />
            </div>

            <div className="
              flex items-center justify-center marker mt-16 pb-16
              lg:text-5xl md:text-4xl sm:text-3xl text-2xl
            ">
                Settings
            </div>

        </div>
    )
}