import ImageUpload from "@/components/shared/fields/ImageUpload";
import SingleSelect from "@/components/shared/fields/SingleSelect";
import { Input } from "@/components/ui/input";
import { useJenisWorkorderStore } from "@/store/useJenisWorkorderStore";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";

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
      <div className="flex flex-col h-[700px] aspect-[1/2] border-black border-4 bg-white rounded-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex p-3 items-center justify-center bg-white">
          <h2 className="text-3xl font-semibold text-black">Preview Form</h2>
          <button
            aria-label="Close"
            title="Close"
            className="absolute right-3 hover:bg-grey-200 rounded-full p-1"
            onClick={onClose}
          >
            <XIcon className="text-black" size={20} />
          </button>
        </div>
        <div className="h-full overflow-y-auto px-5 pb-5">
          <div className="space-y-4">
            {detailForm.map((field) => {
              switch (field.tipeField) {
                case "text":
                  return (
                    <div key={field.id}>
                      <Input
                        label={field.namaField}
                        placeholder={field.hintText}
                        type={field.tipeData ?? ""}
                        unit={field.unitSatuan}
                        min={field.min ?? undefined}
                        max={field.max ?? undefined}
                        description={field.keterangan}
                        required={field.sifat === "mandatory"}
                      />
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
                    <div key={field.id}>
                      <SingleSelect
                        label={field.namaField}
                        placeholder={field.hintText}
                        value={selectedOption}
                        onChange={(selected) =>
                          handleSelectChange(field.id, Number(selected.value))
                        }
                        options={options}
                        unit={field.unitSatuan}
                        description={field.keterangan}
                        required={field.sifat === "mandatory"}
                      />
                    </div>
                  );
                case "image":
                  return (
                    <div key={field.id}>
                      <ImageUpload
                        label={field.namaField}
                        images={uploadedImages[field.id] || []}
                        onChange={(images) =>
                          handleUploadImages(field.id, images)
                        }
                        description={field.keterangan}
                        required={field.sifat === "mandatory"}
                      />
                    </div>
                  );
                case "date":
                  return (
                    <div key={field.id}>
                      <Input
                        type="date"
                        label={field.namaField}
                        description={field.keterangan}
                        required={field.sifat === "mandatory"}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
