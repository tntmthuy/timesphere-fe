// src/features/team/components/reorder/ImagePreviewModal.tsx

type ImagePreviewModalProps = {
  url: string;
  onClose: () => void;
};

const ImagePreviewModal = ({ url, onClose }: ImagePreviewModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white text-[20px] hover:text-gray-300"
      >
        ✖
      </button>

      {/* Nút tải */}
      <a
        href={url}
        download
        className="absolute top-3 left-3 text-white text-[13px] bg-white/20 px-2 py-1 rounded hover:bg-white/30"
      >
        Download
      </a>

      {/* Ảnh preview */}
      <img
        src={url}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
      />
    </div>
  );
};

export default ImagePreviewModal;