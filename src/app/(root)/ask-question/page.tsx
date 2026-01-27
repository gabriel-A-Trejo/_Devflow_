import { auth } from "@/auth";
import QuestionForm from "@/features/question/components/question-form";
import { Heading } from "@/shared/components/header/heading";
import ROUTES from "@/shared/constants/routes";
import { redirect } from "next/navigation";

const AskQuestion = async () => {
  const session = await auth();
  if (!session) return redirect(ROUTES.SIGNIN);
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
