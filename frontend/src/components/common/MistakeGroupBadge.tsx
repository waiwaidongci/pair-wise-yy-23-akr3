import { MistakeGroupStatusText } from "../../constants/MistakeGroupStatus";
import type { MistakeGroupStatus } from "../../constants/MistakeGroupStatus";

export function MistakeGroupBadge({ status }: { status: MistakeGroupStatus }) {
  return <span className={"badge mistake-group-" + status.toLowerCase()}>{MistakeGroupStatusText[status]}</span>;
}
