import * as React from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopTimePicker from "@mui/lab/DesktopTimePicker";

export default function CustomizedTimePicker({
  label,
  value,
  onPickerChange,
  renderPickerInput,
  minTimeAllowed,
  maxTimeAllowed,
  maxDateTimeAllowed,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopTimePicker
        label={label}
        value={value}
        onChange={onPickerChange}
        renderInput={renderPickerInput}
        minTime={minTimeAllowed}
        maxTime={maxTimeAllowed}
        helperText="Some important text"
        maxDateTime={maxDateTimeAllowed}
      />
    </LocalizationProvider>
  );
}
