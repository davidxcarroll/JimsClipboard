import clipImage from '../assets/clip-305.png'

export function Settings() {
    return (
        <div className="flex flex-col pb-24 gap-24 sm:px-8 bg-white">

            <div className="
                relative z-10 flex items-center justify-center
                lg:-mt-32 md:-mt-28 -mt-16
            ">
                <img
                    className="lg:w-[700px] md:w-[600px] w-[450px] min-w-[300px] h-auto"
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