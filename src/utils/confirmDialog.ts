import Swal from "sweetalert2";

export const confirmDialog = async (
  title: string,
  text: string,
  confirmText = "Ya",
  cancelText = "Batal"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};
