import * as React from "react";
import useEffect from "react";

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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopTimePicker from "@mui/lab/DesktopTimePicker";
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

      let lastId = result.data[result.data.length - 1].id;
      let lastRow = result.data[result.data.length - 1].day;
      let lastYear = parseInt(lastRow.substring(0, 4));
      let lastMonth = parseInt(lastRow.substring(5, 7));
      let lastDay = parseInt(lastRow.substring(8));

      //Check if the current day is Friday or Saturday
      if (currentDayOfTheWeek === 5 || currentDayOfTheWeek == 6) {
        setRows(result.data);
      }

      //If it's a new working day
      else if (
        (currentDay > lastDay && lastMonth === currentMonth) ||
        (currentDay < lastDay && currentMonth > lastMonth) ||
        (currentDay < lastDay &&
          currentMonth < lastMonth &&
          currentYear > lastYear)
      ) {
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

        let newDayRow = {
          id: lastId + 1,
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
  }, []);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateHours = (arrivedTime, exitTime, id) => {
    var arrivedHour = parseInt(arrivedTime.substring(0, 2));
    var arrivedMinute = parseInt(arrivedTime.substring(3, 5));
    var exitHour = parseInt(exitTime.substring(0, 2));
    var exitMinute = parseInt(exitTime.substring(3, 5));
    var totalHours = exitHour - arrivedHour;
    var totalMinutes = arrivedMinute + exitMinute;
    if (totalMinutes % 60 !== 0) {
      totalHours += 1;
      totalMinutes = totalMinutes % 60;
    } else {
      totalHours += 1;
      totalMinutes = totalMinutes % 60;
    }
    let workedHours = "";
    if (totalMinutes === 0) {
      workedHours = totalHours + " hours";
    } else if (totalMinutes === 1) {
      workedHours = totalHours + " hours and " + totalMinutes + " minute";
    } else {
      workedHours = totalHours + " hours and " + totalMinutes + " minutes";
    }
    axios.patch("http://localhost:3000/days/" + id, {
      workedhours: workedHours,
    });

    return workedHours;
  };

  const status = (arrivedTime, exitTime, id) => {
    var arrivedHour = parseInt(arrivedTime.substring(0, 2));
    var arrivedMinute = parseInt(arrivedTime.substring(3, 5));
    var exitHour = parseInt(exitTime.substring(0, 2));
    var exitMinute = parseInt(exitTime.substring(3, 5));
    var totalHours = exitHour - arrivedHour;
    var totalMinutes = arrivedMinute + exitMinute;
    if (totalMinutes % 60 !== 0) {
      totalHours += 1;
      totalMinutes = totalMinutes % 60;
    } else {
      totalHours += 1;
      totalMinutes = totalMinutes % 60;
    }
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

  const newDateIntializing = (newValue) => {
    var newDate = "";
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
                          label="Add arrived time starting from 8"
                          value={value}
                          onPickerChange={(newValue) => {
                            setValue(newValue);

                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                arrived: newDateIntializing(newValue),
                              }
                            );
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={new Date(0, 0, 0, 8)}
                          maxTimeAllowed={new Date(0, 0, 0, 18)}
                        />

                        <EnterButton
                          onButtonClick={() => {
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
                  ) : (
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

                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                lunch: newDateIntializing(newValue),
                              }
                            );
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={new Date(0, 0, 0, 8)}
                          maxTimeAllowed={new Date(0, 0, 0, 18)}
                        />

                        <EnterButton
                          onButtonClick={() => {
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
                  {row.exit !== "" ? (
                    row.exit
                  ) : (
                    <div>
                      <Stack
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CustomizedTimePicker
                          label="Add exit time till 6"
                          value={value}
                          onPickerChange={(newValue) => {
                            setValue(newValue);

                            axios.patch(
                              "http://localhost:3000/days/" + row.id,
                              {
                                exit: newDateIntializing(newValue),
                              }
                            );
                          }}
                          renderPickerInput={(params) => (
                            <TextField {...params} />
                          )}
                          minTimeAllowed={new Date(0, 0, 0, 8)}
                          maxTimeAllowed={new Date(0, 0, 0, 18)}
                        />

                        <EnterButton
                          onButtonClick={() => {
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
                  {row.arrived !== "" &&
                  row.exit !== "" &&
                  row.workedhours == ""
                    ? calculateHours(row.arrived, row.exit, row.id)
                    : row.workedhours}
                </TableCell>

                <TableCell align="center">
                  {row.arrived !== "" && row.exit !== ""
                    ? status(row.arrived, row.exit, row.id)
                    : row.status}
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
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
    </div>
  );
}
