import "./RadioGroup.scss";

type RadioOption = {
  key: string;
  value: string;
};

type RadioGroupProps = {
  question: string;
  options: RadioOption[];
  groupName: string;
  selectedOption: string;
  handleChange(value: string): void;
};

const RadioGroup = ({
  question = "",
  options = [],
  groupName,
  selectedOption,
  handleChange,
}: RadioGroupProps) => {
  if (!options.length) {
    return null;
  }

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  };

  return (
    <fieldset className="radio-group">
      {question && <span className="radio-group_question">{question}</span>}
      {options.map(({ key, value }) => (
        <div className="radio-group_option" key={key}>
          <input
            id={key}
            value={key}
            className="radio-group_option_input"
            type="radio"
            name={groupName}
            onChange={onHandleChange}
            {...(key === selectedOption ? { defaultChecked: true } : {})}
          />
          <label className="radio-group_option_label" htmlFor={key}>
            {value}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

export default RadioGroup;
