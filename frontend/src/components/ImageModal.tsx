import { X, ZoomIn, ZoomOut } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  imageUrl: string;
  image_name: string;
  setIsMoadlOpen: React.Dispatch<React.SetStateAction<number>>;
}

const ImageModal: React.FC<Props> = ({
  imageUrl,
  setIsMoadlOpen,
  image_name,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
      dragElastic={0.2}
      className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-2xl z-50 rounded-lg p-4 w-[70vw] max-w-3xl cursor-move"
      style={{ backdropFilter: "blur(8px)" }} // Optional visual separation
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-800 font-semibold truncate">{image_name}</p>
        <X
          size={28}
          onClick={() => setIsMoadlOpen(-1)}
          className="cursor-pointer text-gray-500 hover:text-black"
        />
      </div>

      {/* Image Container */}
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-gray-100 rounded-md">
        <img
          src={imageUrl}
          alt="Modal Content"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: "transform 0.2s ease-in-out",
          }}
          className="max-w-full max-h-full object-contain rounded-md"
        />

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 bg-white p-2 rounded shadow-md z-10">
          <button
            onClick={handleZoomIn}
            className="text-gray-700 hover:text-black"
          >
            <ZoomIn />
          </button>
          <button
            onClick={handleZoomOut}
            className="text-gray-700 hover:text-black"
          >
            <ZoomOut />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageModal;
