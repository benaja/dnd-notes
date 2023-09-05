import SelectField from "../fields/SelectField";
import SelectInput from "../fields/inputs/SelectInput";

const questStates = [
  { value: null, label: "All" },
  { value: "open", label: "Open" },
  { value: "inProgress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "onHold", label: "On Hold" },
];

export default function SelectQuestStatus({
  ...props
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return <SelectInput label="Status" options={questStates} {...props} />;
}
