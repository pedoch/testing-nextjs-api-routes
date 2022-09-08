import { Button } from "./Button";
import { Input } from "./Input";

export const QuestionForm = ({
  question,
  index,
  onDelete,
  onQuestionChange,
  addOption,
  removeOption,
  onOptionChange,
  markAsCorrect,
  onMultiChange,
  canDelete,
  disable,
}) => {
  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold">Question {index + 1}</span>
        <div className="flex justify-center items-center space-x-3">
          <p>
            <Input
              type="checkbox"
              disabled={disable}
              checked={question.multi}
              onChange={() => onMultiChange(index)}
            />{" "}
            Multi Select
          </p>
          {canDelete && (
            <Button
              type="button"
              disabled={disable}
              onClick={() => {
                onDelete(index);
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <Input
        placeholder="Enter question"
        required
        disabled={disable}
        value={question.question}
        onChange={(e) => onQuestionChange(e.target.value, index)}
      />
      <div className="mt-3">
        {question.options.map((value, optionIndex) => (
          <div key={optionIndex} className="flex flex-col mb-3">
            <p className="font-semibold">Option {optionIndex + 1}</p>
            <Input
              placeholder="Enter option"
              required
              disabled={disable}
              value={value}
              onChange={(e) =>
                onOptionChange(e.target.value, index, optionIndex)
              }
            />
            <div className="mt-1 flex justify-between">
              <div>
                <Input
                  type={question.multi ? "checkbox" : "radio"}
                  disabled={disable}
                  checked={question.correct.includes(optionIndex)}
                  onChange={() => markAsCorrect(index, optionIndex)}
                />{" "}
                Is correct
              </div>
              <Button
                type="button"
                disabled={disable}
                onClick={() => removeOption(index, optionIndex)}
              >
                Delete Option
              </Button>
            </div>
          </div>
        ))}
      </div>
      {question.options.length < 5 && (
        <Button
          type="button"
          disabled={disable}
          onClick={() => addOption(index)}
        >
          Add Option
        </Button>
      )}
    </div>
  );
};
