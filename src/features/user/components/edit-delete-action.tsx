"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/";
import { Button, toast } from "@/shared/components/ui";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ROUTES from "@/shared/constants/routes";
import { DeleteUserQuestion } from "../actions/delete-user-question.action";
import { deleteUserAnswer } from "../actions/delete-user-answer.action";

interface Props {
  type: "Question" | "Answer";
  itemId: string;
}

const actionMap = {
  Question: (id: string) => DeleteUserQuestion({ questionId: id }),
  Answer: (id: string) => deleteUserAnswer({ answerId: id }),
};

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isAnswer = type === "Answer";

  const handleEdit = () => router.replace(ROUTES.EDITQUESTION(itemId));

  const handleDelete = () => {
    startTransition(async () => {
      const result = await actionMap[type](itemId);

      if (result.success) {
        toast.success(`${type} deleted`, {
          description: `Your ${type.toLowerCase()} has been deleted successfully`,
        });
      } else {
        toast.error("Failed to delete", {
          description: result.error?.message ?? "Something went wrong",
        });
      }
    });
  };

  return (
    <div
      className={`flex items-center justify-end max-sm:w-full ${isAnswer ? "gap-0 justify-center" : ""}`}
    >
      {!isAnswer && (
        <Button variant="ghost" onClick={handleEdit} disabled={isPending}>
          <Edit className="text-primary" aria-label="Edit question" />
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer"
            disabled={isPending}
          >
            <Trash className="text-destructive" aria-label="Delete" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              {isAnswer ? " answer" : " question"} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
