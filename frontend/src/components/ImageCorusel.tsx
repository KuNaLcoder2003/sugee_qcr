// components/ImageSlider.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageType {
  src: string;
  name: string;
}

interface Props {
  images: ImageType[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<number>(-1);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((val)=> val === 0 ? images.length -1 : val -1)
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((val)=> val === images.length -1 ? 0 : val +1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col items-center w-full lg:w-1/2">
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          onClick={handlePrevious}
          className="text-3xl text-gray-600 hover:text-black transition-colors"
        >
          ❮
        </button>

        <div className="relative w-[300px] h-[250px] overflow-hidden rounded-lg shadow-md">
          <AnimatePresence custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full object-cover cursor-pointer"
              onClick={() => setEnlargedImage(currentIndex)}
            />
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="text-3xl text-gray-600 hover:text-black transition-colors"
        >
          ❯
        </button>
      </div>

      {enlargedImage >= 0 && (
        <div className="w-[300px] mt-4 relative">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">{images[enlargedImage].name}</p>
            <X
              className="cursor-pointer"
              onClick={() => setEnlargedImage(-1)}
            />
          </div>
          <img
            src={images[enlargedImage].src}
            className="w-full rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
