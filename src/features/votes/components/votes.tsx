"use client";

import { use, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { formatNumber } from "../../question/lib/formatNumber";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ActionResponses } from "@/shared/types/global";
import type { HasVotedResponse } from "@/shared/types/action";
import { createVote } from "../actions/create-vote.action";

interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponses<HasVotedResponse>>;
  authorId: string;
}

const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetType,
  targetId,
  authorId,
}: Params) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { success, data } = use(hasVotedPromise);
  const { hasUpVoted, hasDownVoted } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!userId;
  const isOwner = userId === authorId;
  const isDisabled = !isAuthenticated || isOwner || isLoading;

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!isAuthenticated)
      return toast.error("Please login to vote", {
        description: "Only logged-in users can vote.",
      });

    if (isOwner) return toast.error("You cannot vote on your own content.");

    setIsLoading(true);

    try {
      const result = await createVote({ targetId, targetType, voteType });

      if (!result.success)
        return toast.error("Failed to vote", {
          description: result.error?.message,
        });

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpVoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownVoted ? "added" : "removed"} successfully`;

      toast.success(successMessage, {
        description: "Your vote has been recorded",
      });
    } catch {
      toast.error("Failed to vote", {
        description: "An error occurred while voting. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <ArrowBigUp
          className={`
            size-4
            ${
              isOwner || !isAuthenticated
                ? "text-muted-foreground"
                : "text-green-500 hover:text-green-500/65"
            }
            ${
              success && hasUpVoted && !isOwner && isAuthenticated
                ? "fill-green-500"
                : ""
            }
            ${
              isDisabled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            }
          `}
          onClick={() => !isDisabled && handleVote("upvote")}
        />
        <p className="text-sm">{formatNumber(upvotes)}</p>
      </div>

      <div className="flex-center gap-1.5">
        <ArrowBigDown
          className={`
            size-4
            ${
              isOwner || !isAuthenticated
                ? "text-muted-foreground"
                : "text-red-500 hover:text-red-500/65"
            }
            ${
              success && hasDownVoted && !isOwner && isAuthenticated
                ? "fill-red-500"
                : ""
            }
            ${
              isDisabled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            }
          `}
          onClick={() => !isDisabled && handleVote("downvote")}
        />
        <p className="text-sm">{formatNumber(downvotes)}</p>
      </div>
    </div>
  );
};

export default Votes;
