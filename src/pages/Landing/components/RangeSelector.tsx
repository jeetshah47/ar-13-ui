import { Box } from "@mui/material";
import { DateRangePicker } from "../../../common/components/DateRangePicker/DateRangePicker";

type RangeSelectorProps = {
  endDate: Date | null;
  startDate: Date | null;
  setEndDate: (endDate: Date | null) => void;
  setStartDate: (startDate: Date | null) => void;
};

const RangeSelector = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: RangeSelectorProps) => {
  return (
    <Box>
      <DateRangePicker
        endDate={endDate}
        startDate={startDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
    </Box>
  );
};

export default RangeSelector;
