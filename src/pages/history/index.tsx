import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchHistory } from "../../api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ data }: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow
        key={data.sk}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {data.event}
        </TableCell>
        <TableCell align="right" component="th" scope="row">
        {new Date(data.eventTimestamp * 1000).toUTCString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <pre>{JSON.stringify(data.changes, null, 4)}</pre>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function History() {
  const { name } = useParams();
  console.log(name);
  const { isLoading: historyLoading, data: history } = useQuery(
    `history-${name}`,
    () => fetchHistory(name as string),
    {
      onSuccess(data) {
        console.log(data);
      },
    }
  );
  return (
    <>
      <Typography pb={5} fontWeight="bold" variant="h3" component="h2">
        {name}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Event</TableCell>
              <TableCell align="right">Date</TableCell>
              {/* <TableCell align="right">value</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {(history ?? []).map((detail: any) => (
              <Row
                key={`${detail.SK}-${detail.eventTimestamp}`}
                data={detail}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
