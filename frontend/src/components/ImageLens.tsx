import React, { useState, useRef } from "react";

interface Props {
  src: string;
  zoom?: number;
}

const ImageLens: React.FC<Props> = ({ src, zoom = 2 }) => {
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!imgRef.current) return;

    const bounds = imgRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    setLensPos({ x, y });
  };

  return (
    <div
      className="relative w-[400px] h-[300px] overflow-hidden border border-gray-300 rounded-md"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setLensVisible(true)}
      onMouseLeave={() => setLensVisible(false)}
      ref={imgRef}
    >
      {/* Main Image */}
      <img src={src} alt="Zoom" className="w-full h-full object-cover" />

      {/* Lens */}
      {lensVisible && (
        <div
          className="absolute w-56 h-40 border-2 border-gray-500 shadow-lg pointer-events-none transition-all duration-200 ease-in-out"
          style={{
            top: `${lensPos.y - 64}px`,
            left: `${lensPos.x - 64}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${400 * zoom}px ${300 * zoom}px`,
            backgroundPosition: `-${lensPos.x * zoom - 64}px -${
              lensPos.y * zoom - 64
            }px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageLens;
