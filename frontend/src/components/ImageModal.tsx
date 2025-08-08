// import { X, ZoomIn, ZoomOut } from "lucide-react";
// import type React from "react";
// import { useState } from "react";
// import { motion } from "framer-motion";

// interface Props {
//   imageUrl: string;
//   image_name: string;
//   setIsMoadlOpen: React.Dispatch<React.SetStateAction<number>>;
// }

// const ImageModal: React.FC<Props> = ({ imageUrl, setIsMoadlOpen, image_name }) => {
//   const [zoomLevel, setZoomLevel] = useState(1);

//   const handleZoomIn = () => {
//     setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // max 3x zoom
//   };

//   const handleZoomOut = () => {
//     setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // min 0.5x zoom
//   };

//   return (
//     <motion.div
//       drag
//       dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
//       dragElastic={0.2}
//       className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-200 border border-gray-300 shadow-lg z-40 rounded-lg p-4 w-[70%] max-w-2xl cursor-move"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-gray-700 font-semibold">{image_name}</p>
//         <X
//           size={28}
//           onClick={() => setIsMoadlOpen(-1)}
//           className="cursor-pointer text-gray-600 hover:text-black"
//         />
//       </div>

//       {/* Image + Zoom Controls */}
//       <div className="w-full h-[400px] relative">
//         <div className="w-full h-full object-contain rounded-md origin-center bg-center bg-cover" style={{backgroundImage : `url(${imageUrl})` , transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out'}} >

//         </div>
//         {/* <img
//           src={imageUrl}
//           alt="Modal Content"
//           style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
//           className="w-full h-full object-contain rounded-md origin-center"
//         /> */}
        
//         {/* Zoom Controls */}
//         <div className="absolute bottom-2 right-2 flex gap-2 bg-white p-2 rounded shadow-md">
//           <button onClick={handleZoomIn} className="text-gray-700 hover:text-black">
//             <ZoomIn />
//           </button>
//           <button onClick={handleZoomOut} className="text-gray-700 hover:text-black">
//             <ZoomOut />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ImageModal;

import { X, ZoomIn, ZoomOut } from "lucide-react";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  imageUrl: string;
  image_name: string;
  setIsMoadlOpen: React.Dispatch<React.SetStateAction<number>>;
}

const ImageModal: React.FC<Props> = ({ imageUrl, setIsMoadlOpen, image_name }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Get natural image size when it loads
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setNaturalSize({
        width: img.width,
        height: img.height,
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
      dragElastic={0.2}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border border-gray-300 shadow-lg z-50 rounded-lg p-4 cursor-move max-w-[58vw] max-h-[70vh] overflow-auto"
      style={{
        width: `${Math.min(naturalSize.width * zoomLevel, window.innerWidth * 0.9)}px`,
        height: `${Math.min(naturalSize.height * zoomLevel, window.innerHeight * 0.9)}px`,
        transition: 'width 0.2s ease, height 0.2s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-700 font-semibold truncate">{image_name}</p>
        <X
          size={28}
          onClick={() => setIsMoadlOpen(-1)}
          className="cursor-pointer text-gray-600 hover:text-black"
        />
      </div>

      {/* Image Container */}
      <div className="w-full h-full flex items-center justify-center overflow-auto rounded">
        <img
          ref={imageRef}
          src={imageUrl}
          alt={image_name}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: "transform 0.2s ease-in-out",
          }}
          className="object-contain max-w-full max-h-full"
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-white p-2 rounded shadow-md z-10">
        <button onClick={handleZoomIn} className="text-gray-700 hover:text-black">
          <ZoomIn />
        </button>
        <button onClick={handleZoomOut} className="text-gray-700 hover:text-black">
          <ZoomOut />
        </button>
      </div>
    </motion.div>
  );
};

export default ImageModal;

