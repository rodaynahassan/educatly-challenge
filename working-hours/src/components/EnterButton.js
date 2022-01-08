import * as React from "react";
import Button from "@mui/material/Button";

import { lightBlue } from "@mui/material/colors";

export default function EnterButton({ onButtonClick }) {
  return (
    <Button
      style={{
        width: "40%",
        backgroundColor: lightBlue[600],
      }}
      onClick={onButtonClick}
      variant="contained"
    >
      Enter
    </Button>
  );
}
