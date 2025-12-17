import ImageUpload from "@/components/shared/fields/ImageUpload";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Input } from "@/components/ui/input";
import { useJenisWorkorderStore } from "../useJenisWorkorderStore";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

interface PreviewFormModalProps {
  onClose: () => void;
}
export default function PreviewFormModal({ onClose }: PreviewFormModalProps) {
  const detailForm = useJenisWorkorderStore(
    (state) => state.formData.detailForm
  );
  const [uploadedImages, setUploadedImages] = useState<
    Record<number, string[]>
  >({});
  const [selectedValues, setSelectedValues] = useState<
    Record<number, number | null>
  >({});

  const handleUploadImages = (fieldId: number, images: string[]) => {
    setUploadedImages((prev) => ({
      ...prev,
      [fieldId]: images,
    }));
  };

  const handleSelectChange = (fieldId: number, selectedId: number) => {
    setSelectedValues((prev) => ({
      ...prev,
      [fieldId]: selectedId,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col h-[700px] aspect-[1/2] border-black border-[4px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="sticky top-0 z-10 flex p-4 items-center justify-center bg-white border-b-2 border-grey-200">
          <h2 className="text-xl font-semibold text-black">Preview Form</h2>
          <button
            aria-label="Close"
            title="Close"
            className="absolute right-4 hover:bg-grey-100 rounded-full p-1.5 transition-colors"
            onClick={onClose}
          >
            <XIcon className="text-grey-700" size={20} />
          </button>
        </div>
        <div className="h-full overflow-y-auto px-5 py-4 bg-white">
          <div className="space-y-5">
            {detailForm.map((field) => {
              switch (field.tipeField) {
                case "text":
                  return (
                    <div key={field.id} className="space-y-1">
                      <Input
                        label={field.namaField}
                        placeholder={field.hintText || `Isi ${field.namaField}`}
                        type={field.tipeData ?? ""}
                        unit={field.unitSatuan}
                        min={field.min ?? undefined}
                        max={field.max ?? undefined}
                        required={field.sifat === "mandatory"}
                      />
                      {field.hintText && (
                        <p className="text-xs text-grey-500 pl-1">{field.hintText}</p>
                      )}
                    </div>
                  );
                case "dropdown":
                  const isChild = field.parent !== 0 && field.parent !== null;
                  let availableOptions = field.optionForm;
                  if (isChild) {
                    const parentValue = selectedValues[field.parent ?? 0];
                    if (parentValue !== undefined && parentValue !== null) {
                      availableOptions = field.optionForm.filter(
                        (opt) => opt.parent === parentValue
                      );
                    }
                  }
                  const options = availableOptions.map((opt) => ({
                    value: String(opt.id),
                    label: opt.namaOpsi,
                  }));
                  const selectedOption =
                    options.find(
                      (opt) => opt.value === String(selectedValues[field.id])
                    ) || null;
                  return (
                    <div key={field.id} className="space-y-1">
                      <SingleSelect
                        label={field.namaField}
                        placeholder={field.hintText || `Pilih ${field.namaField}`}
                        value={selectedOption}
                        onChange={(selected) =>
                          handleSelectChange(field.id, Number(selected.value))
                        }
                        options={options}
                        unit={field.unitSatuan}
                        required={field.sifat === "mandatory"}
                      />
                      {field.hintText && (
                        <p className="text-xs text-grey-500 pl-1">{field.hintText}</p>
                      )}
                    </div>
                  );
                case "image":
                  return (
                    <div key={field.id} className="space-y-1">
                      <ImageUpload
                        label={field.namaField}
                        images={uploadedImages[field.id] || []}
                        onChange={(images) =>
                          handleUploadImages(field.id, images)
                        }
                        required={field.sifat === "mandatory"}
                      />
                      {field.hintText && (
                        <p className="text-xs text-grey-500 pl-1">{field.hintText}</p>
                      )}
                    </div>
                  );
                case "date":
                  return (
                    <div key={field.id} className="space-y-1">
                      <Input
                        type="date"
                        label={field.namaField}
                        placeholder={field.hintText}
                        required={field.sifat === "mandatory"}
                      />
                      {field.hintText && (
                        <p className="text-xs text-grey-500 pl-1">{field.hintText}</p>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          {/* <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-grey-200 p-4 mt-6">
            <button
              type="button"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={() => {
                toast.info("Ini hanya preview form");
                onClose();
              }}
            >
              Submit
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
