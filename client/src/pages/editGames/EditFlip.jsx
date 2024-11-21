import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
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
import philippinesJson from "../../utils/philippines.json";

const PLACES = philippinesJson.map((item) => item.title);

const EditFlip = () => {
  const { getActivity, updateActivity } = useGlobalContext();
  const { week, id } = useParams();

  const [activityId, setActivityId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  // fields
  const [questions, setQuestions] = useState([]);
  const [winPoints, setWinPoints] = useState(0);
  const [losePoints, setLosePoints] = useState(0);
  const [timer, setTimer] = useState(0);

  const [imageFiles, setImageFiles] = useState({});

  const [imagePreview, setImagePreview] = useState({});

  const handleQuestionChange = (e, questionId) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        return { ...question, question: e.target.value };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const handleOptionChange = (e, questionId, optionId) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        const newOptions = question.options.map((option) => {
          if (option._id === optionId) {
            return { ...option, value: e.target.value };
          }
          return option;
        });

        return { ...question, options: newOptions };
      }
      return question;
    });

    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: "added-" + crypto.randomUUID(),
      question: "",
      options: [{ _id: crypto.randomUUID(), value: "" }],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAddOption = (_id) => {
    const newQuestions = questions.map((question) => {
      if (question._id === _id && question.options.length < 4) {
        const newOption = { _id: crypto.randomUUID(), value: "" };
        return {
          ...question,
          options: [...question.options, newOption],
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

  const handleOptionDelete = (questionId, optionId) => {
    console.log("option delete");
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        const newOptions = question.options.filter(
          (option) => option._id !== optionId
        );
        return { ...question, options: newOptions };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const handleChangeAnswer = (questionId, newAnswer) => {
    const newQuestions = questions.map((question) => {
      if (question._id === questionId) {
        return { ...question, correctAnswer: newAnswer };
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
    console.log("forvalidation", questions);
    for (const question of questions) {
      if (!question.correctAnswer) {
        setError("Please ensure each question has a correct answer selected.");
        return;
      }
    }

    const formattedQuestions = questions.map(({ ...question }) => {
      const formattedOptions = question.options.map((option) => {
        return option.value;
      });
      return { ...question, options: formattedOptions };
    });

    // remove undefined fields in imageFiles
    const filteredImageFiles = Object.fromEntries(
      Object.entries(imageFiles).filter(([key, value]) => value !== undefined)
    );

    const newImageFiles = Object.values(filteredImageFiles);
    const imageIds = Object.keys(filteredImageFiles);

    console.log("newImageFiles", newImageFiles);
    console.log("imageIds", imageIds);

    console.log("imagefiles and imageIdsToEdit");
    console.log(newImageFiles, imageIds);

    const formData = new FormData();
    formData.append("questions", JSON.stringify(formattedQuestions));
    formData.append("winPoints", winPoints);
    formData.append("timer", timer);

    formData.append("imageIds[]", imageIds);

    for (const imageFile of newImageFiles) {
      formData.append("imageFiles", imageFile);
    }

    await updateActivity(activityId, formData);
    // reset
    setImageFiles({});
    setRefetch(!refetch);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log("fetdching questoin use effect");
      const activity = await getActivity(id);

      const newQuestions = activity.questions.map((question) => {
        const newOptions = question.options.map((option) => {
          return { _id: crypto.randomUUID(), value: option };
        });
        return { ...question, options: newOptions };
      });

      console.log("newquestions", newQuestions);
      setQuestions(newQuestions);
      setActivityId(activity._id);
      setLosePoints(activity.losePoints);
      setWinPoints(activity.winPoints);

      setLoading(false);
      setTimer(activity.timer);
    })();
  }, [refetch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(""); // Clear error after showing toast
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (Object.keys(imageFiles).length > 0) {
        URL.revokeObjectURL(imageFiles);
      }
    };
  }, [imageFiles]);

  if (loading) {
    return (
      <>
        <Spinner className="size-10" />
      </>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-t from-gray-900 to-slate-50">
      <div className="container mx-auto py-16 px-24">
        <Card className=" border-[#3C3D37] border-8 mx-auto w-full max-w-[50rem] shadow-[0px_20px_20px_10px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024,0px_3px_8px_0px_#00000024]">
          <CardBody className="flex flex-col gap-4 overflow-visible">
            <Typography variant="h3" color="blue-gray">
              Edit Game
            </Typography>

            <div className="w-full  border-gray-300 border"></div>
            <Typography variant="h5" color="blue-gray">
              Edit Points per correct answer
            </Typography>

            <div className="w-fit flex gap-4">
              <Input
                type="number"
                name="winPoints"
                label="points"
                min={0}
                success
                value={winPoints}
                className="text-green-500"
                onChange={handlePointsChange}
              />
            </div>

            <div className="w-full  border-gray-300 border"></div>
            <Typography variant="h5" color="blue-gray">
              Edit Timer
            </Typography>
            <div className="w-fit flex gap-4">
              <Input
                type="number"
                label="Timer/minutes"
                min={0}
                value={timer}
                onChange={(e) => {
                  setTimer(e.target.value);
                }}
              />
            </div>

            <div className="w-full  border-gray-300 border"></div>
            <Typography variant="h5" color="blue-gray">
              Edit Questions
            </Typography>
            {questions.length === 0 && (
              <p className="text-4xl text-center ">No data was found...</p>
            )}

            {questions.map(
              ({ _id, question, options, correctAnswer, imageUrl }, index) => (
                <div
                  key={_id}
                  className="flex flex-col items-center gap-4 mt-4 relative"
                >
                  {/* <TrashIcon
                    className="text-red-500 size-10 absolute top-1 right-1"
                    onClick={() => {
                      handleQuestionDelete(_id);
                    }}
                  /> */}
                  <img
                    src={imagePreview[_id] ? imagePreview[_id] : imageUrl}
                    alt=""
                    className="h-[200px]"
                  />

                  <Input
                    label="Image"
                    id="file_input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImageFiles({
                        ...imageFiles,
                        [_id]: e.target.files[0],
                      });
                      try {
                        const fileURL = URL.createObjectURL(e.target.files[0]);
                        setImagePreview({ ...imagePreview, [_id]: fileURL });
                      } catch (error) {
                        setImagePreview({});
                      }
                    }}
                  />

                  <Input
                    label={`Question ${index + 1}`}
                    value={question}
                    onChange={(e) => {
                      handleQuestionChange(e, _id);
                    }}
                  />

                  <div className="w-[70%]">
                    {options.map((option, index) => {
                      return (
                        <div key={option._id} className="mb-2 flex gap-2">
                          <div
                            className="bg-transparent w-16 rounded-full grid place-items-center"
                            onClick={() => {
                              handleChangeAnswer(_id, option.value);
                            }}
                          >
                            {option.value === correctAnswer ? (
                              <CheckIcon className="size-10 text-center bg-green-500 text-white rounded-full" />
                            ) : (
                              <XMarkIcon className="size-10 text-center bg-red-500 text-white rounded-full" />
                            )}
                          </div>
                          <Input
                            label={`option ${index + 1}`}
                            value={option.value}
                            icon={
                              <TrashIcon
                                className="text-red-500"
                                onClick={() => {
                                  handleOptionDelete(_id, option._id);
                                }}
                              />
                            }
                            onChange={(e) => {
                              handleOptionChange(e, _id, option._id);
                            }}
                          />
                        </div>
                      );
                    })}
                    <div
                      className="flex items-center justify-center border rounded-md w-50 p-2 gap-2 bg-green-500 text-center text-white"
                      onClick={() => {
                        handleAddOption(_id);
                      }}
                    >
                      <CiSquarePlus className="size-6 " />
                      <p className="text-sm">Add Option</p>
                    </div>
                  </div>
                  <div className="w-full  border-gray-300 border"></div>
                </div>
              )
            )}

            {/* <div
              className="flex justify-center  rounded-md bg-blue-900 w-full items-center p-2 gap-2 text-white"
              onClick={handleAddQuestion}
            >
              <CiSquarePlus className="size-6" />
              Add Question
            </div> */}
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
  );
};
export default EditFlip;
