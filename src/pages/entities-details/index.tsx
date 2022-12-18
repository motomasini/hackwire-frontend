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
  Switch,
} from "@mui/material";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { fetchAccounts, fetchEntityDetails, fetchProjects } from "../../api";
import { Account, Project } from "../../api/types";

export default function EntitiesDetails() {
  const { type, id } = useParams();
  const { isLoading: detailsLoading, data: details } = useQuery(
    `entity${id}`,
    () => fetchEntityDetails(type as string, id as string)
  );
  const { isLoading: infosLoading, data: infos } = useQuery(
    `${type}-${id}`,
    (): any => {
      if (!type || !id) return Promise.reject();
      if (type === "project") return fetchProjects();
      return fetchAccounts();
    },
    {
      select(data): Project | Account {
        if (type === "project") {
          return data.filter((d: any) => d.id === id)[0] as Project;
        } else {
          return data.filter(
            (d: any) => d.id === parseInt(id as string)
          )[0] as Account;
        }
      },
    }
  );
  if (!infos || !details) return <div>loading</div>;
  return (
    <>
      <Box display="flex" flexDirection="column" pb={4}>
        <Box display="flex">
          <Typography variant="h4" fontWeight="bold">
            {(infos as any).account_id
              ? (infos as any).name
              : (infos as any).owner.email}{" "}
          </Typography>
          <Typography ml={2} variant="h5">
            ({type})
          </Typography>
        </Box>
        <Typography variant="caption">id: {infos.id}</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">PK</TableCell>
              <TableCell align="right">SK</TableCell>
              <TableCell align="right">value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(details ?? []).map((detail: any) => (
              <TableRow
                key={detail.SK}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {detail.name}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {detail.PK}
                </TableCell>
                <TableCell align="right">{detail.SK}</TableCell>
                <TableCell align="right">
                  <Switch defaultChecked={detail.value === "true"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
