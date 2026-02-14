import { formatNumber } from "@/features/question/lib/formatNumber";
import CompactCard from "@/shared/components/compact/compact-card";
import { BadgeCounts } from "@/shared/types/global";
import { Award } from "lucide-react"; // or Medal, Trophy, etc.
import Image from "next/image";

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className=" flex flex-wrap items-center justify-start gap-4 rounded-md border p-6">
      <Image src={imgUrl} alt="gold medal icon" width={40} height={50} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: BadgeCounts;
}

const Stats = ({ totalAnswers, totalQuestions, badges }: Props) => {
  return (
    <div className="mt-10">
      <h4 className="font-bold text-xl">
        Stats{" "}
        {/* <span className="small-semibold primary-text-gradient">
          {formatNumber(reputationPoints)}
        </span> */}
      </h4>

      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className=" flex flex-wrap items-center justify-evenly gap-4 rounded-md border  p-6">
          <div>
            <p className="font-bold">{formatNumber(totalQuestions)}</p>
            <p className="">Questions</p>
          </div>

          <div>
            <p className="font-bold">{formatNumber(totalAnswers)}</p>
            <p className="">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
