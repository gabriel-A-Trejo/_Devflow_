"use client";

import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { toggleSaveQuestion } from "../actions/toggle-save-question.action";
import { ActionResponses } from "@/shared/types/global";

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponses<{ isSaved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const { data } = use(hasSavedQuestionPromise);
  const { isSaved } = data || {};

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
      className={`cursor-pointer ${isLoading ? "opacity-50" : ""} text-primary ${
        isSaved ? "fill-primary" : "fill-none"
      }`}
      aria-label="Save Question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
