import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  ThemeProvider,
  Typography,
} from "@material-tailwind/react";
import {
  CheckBadgeIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { CiSquarePlus } from "react-icons/ci";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../context/context";

const EditFamilyFeud = () => {
  const { getActivity, updateActivity } = useGlobalContext();
  const { week, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityId, setActivityId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [winPoints, setWinPoints] = useState(0);
  const [losePoints, setLosePoints] = useState(0);
  const [timer, setTimer] = useState(0);

  const handleQuestionChange = (e, questionId) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        return { ...question, question: e.target.value };
      }
      return question;
    });
    setQuestions(newQuestions);
  };
  const handleOptionChange = (e, questionId, answerId) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        const newAnswers = question.answers.map((item) => {
          if (item._id === answerId) {
            return {
              ...item,
              value: { ...item.value, answer: e.target.value },
            };
          }
          return item;
        });

        return { ...question, answers: newAnswers };
      }
      return question;
    });

    setQuestions(newQuestions);
  };
  const handleAnswerPointsChange = (e, questionId, answerId) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        const newAnswers = question.answers.map((item) => {
          if (item._id === answerId) {
            return {
              ...item,
              value: { ...item.value, points: e.target.value },
            };
          }
          return item;
        });

        return { ...question, answers: newAnswers };
      }
      return question;
    });

    setQuestions(newQuestions);
  };
  const handleAddQuestion = () => {
    const newQuestion = {
      _id: crypto.randomUUID(),
      question: "",
      options: [{ _id: crypto.randomUUID(), value: "" }],
    };
    setQuestions([...questions, newQuestion]);
  };
  const handleAddAnswer = (_id) => {
    console.log("adding opton");
    const newQuestions = questions.map((question) => {
      if (question._id === _id) {
        const newAnswer = {
          _id: crypto.randomUUID(),
          value: { answer: "", points: "" },
        };
        return {
          ...question,
          answers: [...question.answers, newAnswer],
        };
      }
      return question;
    });
    setQuestions(newQuestions);
  };
  const handleQuestionDelete = (_id) => {
    const newQuestions = questions.filter((item) => item._id !== _id);
    setQuestions(newQuestions);
  };
  const handleAnswerDelete = (questionId, answerId) => {
    console.log("option delete");
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        const newAnswers = question.answers.filter(
          (answer) => answer._id !== answerId
        );
        return { ...question, answers: newAnswers };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const handlePointsChange = (e) => {
    if (e.target.name === "winPoints") {
      setWinPoints(e.target.value);
    }
    if (e.target.name === "losePoints") {
      setLosePoints(e.target.value);
    }
  };

  const handleSubmit = async () => {
    // Validation: Ensure each question has a correct answer
    for (const question of questions) {
      for (const item of question.answers) {
        console.log("check", item.value.answer);
        if (!item.value.points || !item.value.answer) {
          setError("Please make sure all fields are completed.");
          return;
        }
      }
    }

    const formattedQuestions = questions.map(({ _id, ...question }) => {
      const formattedAnswers = question.answers.map((item) => {
        return item.value;
      });
      return { ...question, answers: formattedAnswers };
    });

    const formData = new FormData();
    formData.append("questions", JSON.stringify(formattedQuestions));
    formData.append("winPoints", winPoints);
    formData.append("losePoints", losePoints);

    updateActivity(activityId, formData);
  };

  const theme = {
    input: {
      styles: {
        base: {
          container: {
            position: "relative",
            width: "w-full",
            minWidth: "min-w-[80px]",
          },
        },
      },
    },
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log("fetdching questoin use effect");
      const activity = await getActivity(id);
      console.log("fetched activity,", activity);

      const newQuestions = activity.questions.map((question) => {
        const newAnswers = question.answers.map((answer) => {
          return { _id: crypto.randomUUID(), value: answer };
        });
        return { ...question, answers: newAnswers };
      });

      console.log("newquestions", newQuestions);
      setQuestions(newQuestions);
      setActivityId(activity._id);
      setLosePoints(activity.losePoints);
      setWinPoints(activity.winPoints);
      setLoading(false);
      setTimer(activity.timer);
    })();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(""); // Clear error after showing toast
    }
  }, [error]);

  if (loading) {
    return (
      <>
        <Spinner className="size-10" />
      </>
    );
  }
  return (
    <ThemeProvider value={theme}>
      <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
        <div className="container mx-auto py-16 px-24 ">
          <Card
            className="border-[#3C3D37] border-8 mx-auto w-full max-w-[50rem] shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]
"
          >
            <CardBody className="flex flex-col gap-4 overflow-visible">
              <Typography variant="h3" color="blue-gray" className="">
                Edit Game
              </Typography>
              <div className="w-full  border-gray-300 border"></div>
              <Typography variant="h5" color="blue-gray">
                Edit Points
              </Typography>
              <div className="w-full flex items-center justify-center gap-4">
                <Input
                  type="number"
                  name="winPoints"
                  label="Win points"
                  min={0}
                  success
                  value={winPoints}
                  className="text-green-500"
                  onChange={handlePointsChange}
                />
                <Input
                  type="number"
                  name="losePoints"
                  label="Lose points"
                  error
                  min={0}
                  value={losePoints}
                  className="text-red-500"
                  onChange={handlePointsChange}
                />
              </div>

              <div className="w-full  border-gray-300 border"></div>
              <div className="w-fit flex gap-4"></div>
              <Typography variant="h5" color="blue-gray">
                Edit Questions
              </Typography>
              {questions.length === 0 && (
                <p className="text-4xl text-center ">No data was found...</p>
              )}
              {questions.map(({ _id, question, answers }, index) => (
                <div
                  key={_id}
                  className="flex flex-col items-center gap-4 mt-4"
                >
                  <Input
                    label={`Question ${index + 1}`}
                    value={question}
                    icon={
                      <TrashIcon
                        className="text-red-500"
                        onClick={() => {
                          handleQuestionDelete(_id);
                        }}
                      />
                    }
                    onChange={(e) => {
                      handleQuestionChange(e, _id);
                    }}
                  />
                  <div className="w-[70%]">
                    {answers.map((item) => {
                      return (
                        <div key={item._id} className="mb-2 flex gap-6 ">
                          <div className="bg-transparent w-16 rounded-full grid place-items-center">
                            <Input
                              min={1}
                              type="number"
                              label="Points"
                              value={item.value.points}
                              onChange={(e) => {
                                handleAnswerPointsChange(e, _id, item._id);
                              }}
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              label="Answer "
                              value={item.value.answer}
                              icon={
                                <TrashIcon
                                  className="text-red-500"
                                  onClick={() => {
                                    handleAnswerDelete(_id, item._id);
                                  }}
                                />
                              }
                              onChange={(e) => {
                                handleOptionChange(e, _id, item._id);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className="flex items-center justify-center border rounded-md w-50 p-2 gap-2 bg-green-500 text-center text-white"
                      onClick={() => {
                        handleAddAnswer(_id);
                      }}
                    >
                      <CiSquarePlus className="size-6 " />
                      <p className="text-sm">Add Answer</p>
                    </div>
                  </div>
                  <hr className="w-full border-[1px]" />
                </div>
              ))}

              <div
                className="flex justify-center  rounded-md bg-blue-900 w-full items-center p-2 gap-2 text-white"
                onClick={handleAddQuestion}
              >
                <CiSquarePlus className="size-6" />
                Add Question
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                className="bg-green-900"
                fullWidth
                onClick={handleSubmit}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};
export default EditFamilyFeud;
