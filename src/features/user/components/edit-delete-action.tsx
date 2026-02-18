"use client";

import React from "react";
interface Props {
  type: string;
  itemId: string;
}

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
} from "@/shared/components/ui/alert-dialog";
import { Button, toast } from "@/shared/components/ui";
import { Edit, FilePenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import ROUTES from "@/shared/constants/routes";

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    router.replace(ROUTES.EDITQUESTION(itemId));
  };
  const handleDelete = async () => {
    if (type === "Question") {
      toast.success("Question deleted", {
        description: "Your question has been deleted successfully",
      });
    } else if (type === "Answer") {
      toast.success("Answer deleted", {
        description: "Your Answer has been deleted successfully",
      });
    }
  };
  return (
    <div
      className={`flex items-center justify-end  max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
    >
      {type === "Question" && (
        <Button variant="ghost" onClick={handleEdit}>
          <Edit className="text-primary" aria-label="edit" />
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            {<Trash className="text-destructive" aria-label="trash" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              {type === "Question" ? " question" : " answer"} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
