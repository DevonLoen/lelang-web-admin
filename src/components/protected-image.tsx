import { useEffect, useState } from "react";

interface ProtectedImageProps {
  url: string;
  token: string;
  alt: string;
  className?: string;
}

export default function ProtectedImage({
  url,
  token,
  alt,
  className,
}: ProtectedImageProps) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    let objectUrl: string;

    const loadImage = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load image");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (error) {
        console.error(error);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, token]);

  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        Loading...
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
}
