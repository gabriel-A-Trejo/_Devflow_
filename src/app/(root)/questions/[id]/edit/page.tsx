import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import type { RouteParams } from "@/shared/types/global";
import ROUTES from "@/shared/constants/routes";
import QuestionForm from "@/features/question/components/question-form";
import { getQuestionById } from "@/features/question/actions/question.action";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  console.log(id);
  if (!id) notFound();

  const session = await auth();
  if (!session) redirect(ROUTES.SIGNIN);

  const { data: question, success } = await getQuestionById({ questionId: id });
  if (!success) notFound();

  if (question?.author._id.toString() !== session?.user?.id)
    redirect(ROUTES.QUESTION(id));

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default Page;
