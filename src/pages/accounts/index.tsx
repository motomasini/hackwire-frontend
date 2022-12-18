import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchAccounts } from "../../api";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";

export default function Accounts() {
  const { isLoading: accountsLoading, data: accounts } = useQuery(
    "accounts",
    fetchAccounts
  );
  return (
    <>
      <Typography pb={5} fontWeight="bold" variant="h2" component="h2">
        Accounts
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Owner</TableCell>
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
                <TableCell align="right">{account.owner.email}</TableCell>
                <TableCell align="right">
                  <MuiLink
                    component={Link}
                    to={`/entities/details/account/${account.id}`}
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
