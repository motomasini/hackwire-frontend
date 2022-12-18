import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link as MuiLink,
  Box,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchProjects } from "../../api";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";

export default function Projects() {
  const { isLoading: accountsLoading, data: accounts } = useQuery(
    "projects",
    fetchProjects
  );
  return (
    <>
      <Typography pb={5} fontWeight="bold" variant="h2" component="h2">
        Projects
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(accounts ?? []).map((account) => (
              <TableRow
                key={account.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {account.id}
                </TableCell>
                <TableCell align="right">{account.name}</TableCell>
                <TableCell align="right">
                  <MuiLink
                    component={Link}
                    to={`/entities/details/project/${account.id}`}
                  >
                    <LaunchIcon />
                  </MuiLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
