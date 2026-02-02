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
}
const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetType,
  targetId,
}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);

  const [isLoading, setIsLoading] = useState(false);

  const { hasUpVoted, hasDownVoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast.error("Please login to vote", {
        description: "Only logged-in users can vote.",
      });

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
    } catch (error) {
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
          className={`text-green-500 size-4 cursor-pointer hover:text-green-500/65  ${success && hasUpVoted && "fill-green-500"} ${isLoading && "opacity-50"}`}
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center ">
          <p className="text-sm">{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <ArrowBigDown
          className={`text-red-500 size-4 cursor-pointer hover:text-red-500/65  ${success && hasDownVoted && "fill-red-500"} ${isLoading && "opacity-50"}`}
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center ">
          <p className="text-sm">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
