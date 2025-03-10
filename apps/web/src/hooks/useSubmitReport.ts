import { trpc } from "../trpc";

export const useSubmitReport = () => {
  const mutation = trpc.submitReport.useMutation();

  const submitReport = async ({ roomId, reportType, comment }) => {
    try {
      const response = await mutation.mutateAsync({
        roomId,
        reportType,
        comment,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to submit report");
    }
  };

  return {
    submitReport,
    isSubmitting: mutation.status === "pending",
    isSuccess: mutation.status === "success",
    isError: mutation.status === "error",
    error: mutation.error
  };
};
