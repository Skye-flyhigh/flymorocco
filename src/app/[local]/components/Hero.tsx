export default function Hero( {
    title,
    subtitle,
    img,
} : {
    title: string;
    subtitle: string;
    img: string;
} ) {

    return (
        // FIXME: That parallax effect can look weird on safari for iPhone users. To be tested
        <section id='hero' className="relative h-[70vh] bg-fixed bg-center bg-cover hero min-h-80" style={{
            backgroundImage: `url(${img})`
        }}>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">{title}</h1>
                    <p className="mb-5">{subtitle}</p>
                </div>
            </div>
        </section>
    )
}