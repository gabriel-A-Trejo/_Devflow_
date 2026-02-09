"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { toggleSaveQuestion } from "../actions/toggle-save-question.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  let hasSaved = false;

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error("You need to be logged in to save a question");
    }

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "An error occurred");
      toast.success(
        `Question ${data?.isSaved ? "saved" : "unsaved"} successfully`,
      );
      hasSaved = true;
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error?.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Star
      className={`cursor-pointer ${isLoading && "opacity-50"} text-primary ${hasSaved && "fill-primary"}`}
      arial-label="Save Question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
