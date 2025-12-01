import { useState, useEffect, useRef } from "react";
export default function LazyImage({
    src,
    alt,
    className = "",
    placeholder = null,
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "50px",
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <div ref={imgRef} className={`relative ${className}`}>
            {!isLoaded && placeholder && (
                <div className="absolute inset-0 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
            )}

            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className={`${className} transition-opacity duration-300 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    );
}
