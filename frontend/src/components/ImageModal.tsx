import { X } from "lucide-react";
import type React from "react";

interface Props {
    imageUrl: string,
    setIsMoadlOpen: React.Dispatch<React.SetStateAction<number>>,
    image_name: string
}
const ImageModal: React.FC<Props> = ({ imageUrl, setIsMoadlOpen , image_name }) => {
    return (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg relative flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-white">
                    <p className="font-bold">{image_name}</p>
                    <X size={32} onClick={() => setIsMoadlOpen(-1)} className="cursor-pointer" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg w-full">
                    <img src={imageUrl} alt="Modal Content" className="w-full h-auto rounded-lg object-cover" />
                </div>
            </div>
        </div>
    )
}

export default ImageModal;