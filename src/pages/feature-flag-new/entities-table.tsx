import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Switch, Typography } from "@mui/material";
import { Account, Project } from "../../api/types";

interface EntityTableProps {
  entities: (Account | Project)[];
  toggledEntities: (string | number)[];
  onToggle: (id: number | string, remove: boolean) => void;
}

export default function EntityTable({
  entities,
  toggledEntities,
  onToggle,
}: EntityTableProps) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Owner / Name</TableCell>
            <TableCell align="right">Toggle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entities
            .sort((a, b) => {
              return (
                Number(toggledEntities.includes(b.id)) -
                Number(toggledEntities.includes(a.id))
              );
            })
            .map((entity) => (
              <TableRow
                key={entity.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entity.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {!!(entity as any).owner ? "ACCOUNT" : "PROJECT"}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {(entity as any).owner
                    ? (entity as any).owner.email
                    : (entity as any).name}
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  <Switch
                    onChange={() =>
                      onToggle(entity.id, toggledEntities.includes(entity.id))
                    }
                    checked={toggledEntities.includes(entity.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
