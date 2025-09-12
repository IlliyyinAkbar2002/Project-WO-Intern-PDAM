import { useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon, PlusIcon, XIcon } from "@phosphor-icons/react";

interface ImageUploadProps {
  label?: string;
  images: string[];
  onChange?: (images: string[]) => void;
  readOnly?: boolean;
  required?: boolean;
  description?: string | null;
}

export default function ImageUpload({
  label,
  images,
  onChange,
  readOnly,
  required,
  description,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);

  const handleRemove = (index: number) => {
    if (!onChange) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange || !e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    onChange([...images, ...urls]);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-base font-medium text-primary-500">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <span className="text-grey-500 text-xs">{description}</span>
        )}
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {images.length > 0
            ? images.map((url, index) => (
                <div key={index} className="relative w-[80px] h-[80px]">
                  <Image
                    src={url}
                    alt={`image-${index}`}
                    width={80}
                    height={80}
                    className="object-cover rounded w-full h-full"
                    onClick={() => setFullImage(url)}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      title={`Delete Image ${index + 1}`}
                      aria-label={`Delete Image ${index + 1}`}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => handleRemove(index)}
                    >
                      <XIcon size={10} />
                    </button>
                  )}
                </div>
              ))
            : !readOnly && (
                <div className="w-[80px] h-[80px] border-2 border-dashed border-grey-300 rounded flex items-center justify-center">
                  <CameraIcon size={24} className="text-grey-500" />
                </div>
              )}

          {!readOnly && images.length === 0 && (
            <div className="flex w-[80px] h-[80px] items-center justify-center">
              <button
                type="button"
                title="Add Image"
                className="flex items-center justify-center bg-primary-400 rounded-full p-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <PlusIcon size={18} className="text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
      {fullImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor-zoom-out">
          <img
            src={fullImage}
            alt="Full screen"
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-5 right-5 bg-red-500 text-white rounded-full p-2"
            onClick={() => setFullImage(null)}
          >
            <XIcon size={18} />
          </button>
        </div>
      )}
    </>
  );
}
