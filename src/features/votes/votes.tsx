"use client";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { formatNumber } from "../question/lib/formatNumber";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Params {
  upvotes: number;
  downvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}
const Votes = ({ upvotes, downvotes, hasUpVoted, hasDownVoted }: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast.error("Please login to vote", {
        description: "Only logged-in users can vote.",
      });

    setIsLoading(true);

    try {
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
          className={`text-green-500 size-4 cursor-pointer hover:text-green-500/65  ${hasUpVoted && "fill-green-500"} ${isLoading && "opacity-50"}`}
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center ">
          <p className="text-sm">{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <ArrowBigDown
          className={`text-red-500 size-4 cursor-pointer hover:text-red-500/65  ${hasDownVoted && "fill-red-500"} ${isLoading && "opacity-50"}`}
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
