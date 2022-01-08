import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableFooter from "@mui/material/TableFooter";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import { lightBlue } from "@mui/material/colors";

import EnterButton from "../components/EnterButton";
import CustomizedTimePicker from "../components/CustomizedTimePicker";

const axios = require("axios");

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box style={{ marginRight: "25px" }} sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function HomePage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(new Date());
  const [rows, setRows] = React.useState([]);
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [currentDay, setCurrentDay] = React.useState(new Date().getDate());
  const [currentDayOfTheWeek, setCurrentDayOfTheWeek] = React.useState(
    new Date().getDay()
  );

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3000/days");
      let arr = [];
      let data = arr.concat(result.data);
      let lastDayIndex = data.length - 1;
      let lastId = data[lastDayIndex].id;
      let lastRow = data[lastDayIndex].day;
      let lastYear = parseInt(lastRow.substring(0, 4));
      let lastMonth = parseInt(lastRow.substring(5, 7));
      let lastDay = parseInt(lastRow.substring(8));
      let lastArrivedTime = data[lastDayIndex].arrived;
      let lastExitTime = data[lastDayIndex].exit;

      //If it's a new working day
      if (
        (currentDay > lastDay && lastMonth === currentMonth) ||
        (currentDay < lastDay && currentMonth > lastMonth) ||
        (currentDay < lastDay &&
          currentMonth < lastMonth &&
          currentYear > lastYear)
      ) {
        //Check if the day passed without entering times
        let removed = false;
        if (lastArrivedTime === "" || lastExitTime === "") {
          removed = true;
          data.pop();
          axios.delete("http://localhost:3000/days/" + lastId);
        }

        //Check if it's Friday or Saturday
        if (currentDayOfTheWeek === 5 || currentDayOfTheWeek === 6) {
          setRows(data);
        } else {
          let newDayDate = "";
          var newMonth = "";
          var newDay = "";
          if (currentMonth < 10) {
            newMonth = newMonth + "0" + currentMonth;
          } else {
            newMonth += currentMonth;
          }

          if (currentDay < 10) {
            newDay = newDay + "0" + currentDay;
          } else {
            newDay += currentDay;
          }

          newDayDate = currentYear + "-" + newMonth + "-" + newDay;
          if (!removed) {
            lastId += 1;
          }
          let newDayRow = {
            id: lastId,
            day: newDayDate,
            arrived: "",
            exit: "",
            lunch: "",
            workedhours: "",
            status: "",
          };

          data.push(newDayRow);
          setRows(data);

          axios.post("http://localhost:3000/days", newDayRow);
        }
      }
      //If we are still on the same day
      else if (
        currentDay === lastDay &&
        currentMonth === lastMonth &&
        currentYear === lastYear
      ) {
        setRows(result.data);
      }
    };

    fetchData();
    lastSevendays();
  }, [currentDay, currentDayOfTheWeek, currentMonth, currentYear]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const workedHoursParser = (value) => {
    let workedHours = parseInt(value.substring(0, 2));
    let workedMinutes = parseInt(value.substring(3, 5));
    let totalWorkedHours = "" + workedHours;
    if (workedHours > 1) {
      totalWorkedHours += " hours";
    } else {
      totalWorkedHours += " hour";
    }

    if (workedMinutes > 0) {
      totalWorkedHours = totalWorkedHours + " and " + workedMinutes;
    }
    if (workedMinutes > 1) {
      totalWorkedHours += " minutes";
    } else if (workedMinutes !== 0) {
      totalWorkedHours += " minute";
    }

    return totalWorkedHours;
  };
  const calculateHours = (arrivedTime, exitTime, id) => {
    var arrivedHour = parseInt(arrivedTime.substring(0, 2));
    var arrivedMinute = parseInt(arrivedTime.substring(3, 5));
    var exitHour = parseInt(exitTime.substring(0, 2));
    var exitMinute = parseInt(exitTime.substring(3, 5));
    var totalMinutes = exitMinute - arrivedMinute;
    var totalHours = exitHour - arrivedHour;
    if (totalMinutes < 0) {
      totalMinutes += 60;
      totalHours -= 1;
    }

    let workedHoursDb = "";
    if (totalHours < 10) {
      workedHoursDb = "0" + totalHours + ":";
    } else {
      workedHoursDb = totalHours + ":";
    }
    if (totalMinutes < 10) {
      workedHoursDb = workedHoursDb + "0" + totalMinutes;
    } else {
      workedHoursDb = workedHoursDb + totalMinutes;
    }
    axios.patch("http://localhost:3000/days/" + id, {
      workedhours: workedHoursDb,
    });
    return workedHoursParser(workedHoursDb);
  };

  const status = (arrivedTime, exitTime, id) => {
    var arrivedHour = parseInt(arrivedTime.substring(0, 2));
    var arrivedMinute = parseInt(arrivedTime.substring(3, 5));
    var exitHour = parseInt(exitTime.substring(0, 2));
    var exitMinute = parseInt(exitTime.substring(3, 5));
    var totalMinutes = exitMinute - arrivedMinute;
    var totalHours = exitHour - arrivedHour;
    if (totalMinutes < 0) {
      totalMinutes += 60;
      totalHours -= 1;
    }
    console.log(totalHours);
    let status = "";
    if (totalHours < 8) {
      status = "Below";
    } else {
      status = "Above";
    }
    axios.patch("http://localhost:3000/days/" + id, {
      status: status,
    });

    return status;
  };

  const newArrivedDateIntializing = (newValue, min, max1, max2) => {
    var newDate = "";
    if (
      newValue.getTime() > min ||
      newValue.getTime() < max1 ||
      newValue.getTime() < max2
    )
      if (newValue.getHours() < 10) {
        newDate = newDate + "0" + newValue.getHours() + ":";
      } else {
        newDate = newDate + newValue.getHours() + ":";
      }

    if (newValue.getMinutes() < 10) {
      newDate = newDate + "0" + newValue.getMinutes() + ":";
    } else {
      newDate = newDate + newValue.getMinutes() + " ";
    }
    if (newValue.getHours() < 12) {
      newDate += "AM";
    } else {
      newDate += "PM";
    }
    return newDate;
  };

  const arrivedTimeParser = (arrivedTimeValue, newValue) => {
    var arrivedHour = parseInt(arrivedTimeValue.substring(0, 2));
    var arrivedMinute = parseInt(arrivedTimeValue.substring(3, 5));
    var arrivedTime = new Date(
      newValue.getFullYear(),
      newValue.getMonth(),
      newValue.getDate(),
      arrivedHour,
      arrivedMinute
    );
    return arrivedTime;
  };
  const newDateIntializing = (newValue, min1, max1, max2) => {
    var newDate = "";
    var arrivedTime = arrivedTimeParser(min1, newValue);
    if (
      newValue.getTime() > arrivedTime ||
      newValue.getTime() < max1 ||
      newValue.getTime() < max2
    )
      if (newValue.getHours() < 10) {
        newDate = newDate + "0" + newValue.getHours() + ":";
      } else {
        newDate = newDate + newValue.getHours() + ":";
      }

    if (newValue.getMinutes() < 10) {
      newDate = newDate + "0" + newValue.getMinutes() + ":";
    } else {
      newDate = newDate + newValue.getMinutes() + " ";
    }
    if (newValue.getHours() < 12) {
      newDate += "AM";
    } else {
      newDate += "PM";
    }
    return newDate;
  };

  const lastSevendays = () => {
    let rowsCopy = [];
    let sevenDays = rowsCopy.concat(rows);
    sevenDays.splice(0, sevenDays.length - 8);
    sevenDays.pop();

    let sevenDaysWorkedHours = [];
    for (let i = 0; i < sevenDays.length; i++) {
      sevenDaysWorkedHours.push(sevenDays[i].workedhours);
    }

    let sevenDaysHours = [];
    let sevenDaysMinutes = [];

    for (let j = 0; j < sevenDaysWorkedHours.length; j++) {
      let workedHour = parseInt(sevenDaysWorkedHours[j].substring(0, 2));
      sevenDaysHours.push(workedHour);
      let workedMinute = parseInt(sevenDaysWorkedHours[j].substring(3, 5));
      sevenDaysMinutes.push(workedMinute);
    }

    let hoursSum = 0;
    for (let k = 0; k < sevenDaysHours.length; k++) {
      hoursSum += sevenDaysHours[k];
    }

    let minutesSum = 0;
    for (let l = 0; l < sevenDaysMinutes.length; l++) {
      minutesSum += sevenDaysMinutes[l];
    }

    hoursSum += parseInt(minutesSum / 60);
    minutesSum = parseInt(minutesSum % 60);

    let totalWorkedHours = hoursSum + " hours";
    if (minutesSum > 0) {
      totalWorkedHours = totalWorkedHours + " and " + minutesSum + " minutes";
    }
    return totalWorkedHours;
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        {" "}
        Track your working hours history easily!
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: lightBlue[200] }}>
            <TableRow>
              <TableCell>Day </TableCell>
              <TableCell align="center">Arrived Time</TableCell>
              <TableCell align="center">Lunch Break</TableCell>
              <TableCell align="center">Exit Time</TableCell>
              <TableCell align="center">Worked Hours</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => (
              <TableRow
                hover
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.day}
                </TableCell>
                <TableCell align="center">
                  {row.arrived !== "" ? (
                    row.arrived
                  ) : (
                    <div>
                      <Stack
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CustomizedTimePicker
                          label="Add arrived time from 8 to 6"
                          value={value}
                          onPickerChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={new Date(0, 0, 0, 8)}
                          maxTimeAllowed={new Date(0, 0, 0, 18, 1)}
                        />

                        <EnterButton
                          onButtonClick={() => {
                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                arrived: newArrivedDateIntializing(
                                  value,
                                  new Date(
                                    value.getFullYear(),
                                    value.getMonth(),
                                    value.getDate(),
                                    8
                                  ),
                                  new Date(
                                    value.getFullYear(),
                                    value.getMonth(),
                                    value.getDate(),
                                    18
                                  ),
                                  new Date()
                                ),
                              }
                            );

                            axios
                              .get("http://localhost:3000/days")
                              .then((resp) => {
                                setRows(resp.data);
                              });
                          }}
                        />
                      </Stack>
                    </div>
                  )}
                </TableCell>
                <TableCell align="center">
                  {row.lunch !== "" ? (
                    row.lunch
                  ) : row.arrived !== "" ? (
                    <div>
                      <Stack
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CustomizedTimePicker
                          label="Add lunch break time from 8 to 6"
                          value={value}
                          onPickerChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={arrivedTimeParser(row.arrived, value)}
                          maxTimeAllowed={new Date(0, 0, 0, 18, 1)}
                        />

                        <EnterButton
                          onButtonClick={() => {
                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                lunch: newDateIntializing(
                                  value,
                                  row.arrived,
                                  new Date(
                                    value.getFullYear(),
                                    value.getMonth(),
                                    value.getDate(),
                                    18
                                  )
                                ),
                              }
                            );

                            axios
                              .get("http://localhost:3000/days")
                              .then((resp) => {
                                setRows(resp.data);
                              });
                          }}
                        />
                      </Stack>
                    </div>
                  ) : (
                    <p style={{ color: "red" }}>
                      {" "}
                      Please enter arrived time first!
                    </p>
                  )}
                </TableCell>
                {row.arrived ? true : row.arrived ? false : null}
                <TableCell align="center">
                  {row.exit !== "" ? (
                    row.exit
                  ) : row.arrived !== "" ? (
                    <div>
                      <Stack
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CustomizedTimePicker
                          label="Add exit between arrived time and 6"
                          value={value}
                          onPickerChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={arrivedTimeParser(row.arrived, value)}
                          maxTimeAllowed={new Date(0, 0, 0, 18, 1)}
                        />

                        <EnterButton
                          onButtonClick={() => {
                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                exit: newDateIntializing(
                                  value,
                                  row.arrived,
                                  new Date(
                                    value.getFullYear(),
                                    value.getMonth(),
                                    value.getDate(),
                                    18
                                  ),
                                  new Date()
                                ),
                              }
                            );

                            axios
                              .get("http://localhost:3000/days")
                              .then((resp) => {
                                setRows(resp.data);
                              });
                          }}
                        />
                      </Stack>
                    </div>
                  ) : (
                    <p style={{ color: "red" }}>
                      {" "}
                      Please enter arrived time first!
                    </p>
                  )}
                </TableCell>

                <TableCell align="center">
                  {row.arrived !== "" &&
                  row.exit !== "" &&
                  row.workedhours === ""
                    ? calculateHours(row.arrived, row.exit, row.id)
                    : row.workedhours !== ""
                    ? workedHoursParser(row.workedhours)
                    : ""}
                </TableCell>

                <TableCell align="center">
                  {row.arrived !== "" &&
                  row.exit !== "" &&
                  row.status === "" ? (
                    status(row.arrived, row.exit, row.id) === "Below" ? (
                      <p style={{ color: "red" }}> Below </p>
                    ) : (
                      <p style={{ color: "green" }}> Above </p>
                    )
                  ) : row.status === "Below" ? (
                    <p style={{ color: "red" }}> {row.status} </p>
                  ) : (
                    <p style={{ color: "green" }}> {row.status} </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                style={{ position: "absolute", right: "0", width: "100%" }}
                rowsPerPageOptions={[
                  5,
                  10,
                  15,
                  20,
                  { label: "All", value: -1 },
                ]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <p style={{ color: lightBlue[600], marginLeft: "5%" }}>
        {" "}
        You have worked for {lastSevendays()} in the last 7 days.{" "}
      </p>
    </div>
  );
}
