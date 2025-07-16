// src/features/team/components/previewimg/ImageGalleryPreviewModal.tsx

import { useEffect, useState } from "react";

type ImageGalleryPreviewModalProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

const ImageGalleryPreviewModal = ({
  images,
  initialIndex,
  onClose,
}: ImageGalleryPreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentUrl = images[currentIndex];

  //xử lý phím mũi tên
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, images.length]);

  return (
    <div
      className="bg-opacity-60 fixed inset-0 z-[100] flex items-center justify-center bg-gray-200"
      onClick={onClose}
    >
      {/* Nút đóng */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 text-[22px] text-white hover:text-gray-300"
      >
        ✖
      </button>

      {/* Nút tải */}
      <a
        href={currentUrl}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 rounded bg-white/20 px-2 py-1 text-[13px] text-white hover:bg-white/30"
      >
        Download
      </a>

      {/* Ảnh hiện tại */}
      <img
        src={currentUrl}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
      />

      {/* Mũi tên chuyển ảnh */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-5 text-[30px] text-white hover:text-gray-300"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-5 text-[30px] text-white hover:text-gray-300"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default ImageGalleryPreviewModal;
