import QuestionForm from "@/features/question/components/question-form";
import { Heading } from "@/shared/components/header/heading";

const AskQuestion = () => {
  return (
    <>
      <Heading>Ask a Question</Heading>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskQuestion;
