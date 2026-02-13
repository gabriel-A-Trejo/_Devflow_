import DataRenderer from "@/shared/components/data-renderer";
import { EMPTY_ANSWERS } from "@/shared/constants/states";
import type { ActionResponses, Answer } from "@/shared/types/global";
import AnswerCard from "./answer-card";
import { AnswerFilters } from "@/shared/constants/filters";
import Filter from "@/shared/components/filters/Filter";
import Pagination from "@/shared/components/pagination/Pagination";

interface Props extends ActionResponses<Answer[]> {
  totalAnswers: number;
  page: number;
  isNext: boolean;
}

const AllAnswers = ({
  page,
  isNext,
  data,
  success,
  error,
  totalAnswers,
}: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        {totalAnswers > 0 && (
          <h3 className="text-primary">
            {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
          </h3>
        )}
        <Filter filters={AnswerFilters} showToggleOnly />
      </div>
      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />
      <Pagination page={page} isNext={isNext} />
    </div>
  );
};

export default AllAnswers;
