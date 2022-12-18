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
  toggledEntities: {
    id: string;
    value: "true" | "false";
    type: "ACCOUNT" | "PROJECT";
  }[];
  onToggle: (
    id: string,
    remove: boolean,
    entityType: "ACCOUNT" | "PROJECT"
  ) => void;
}

export default function EntityTable({
  entities,
  toggledEntities,
  onToggle,
}: EntityTableProps) {
  const toggledEntitiesIds = toggledEntities.map((e) => e.id);
  const sorted = entities.sort((a, b) => {
    return (
      Number(toggledEntitiesIds.includes(b.id.toString())) -
      Number(toggledEntitiesIds.includes(a.id.toString()))
    );
  });
  const separatorIndex = toggledEntities.length - 1;
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
          {sorted.map((entity, index) => (
            <TableRow
              key={entity.id.toString()}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor:
                  index <= separatorIndex ? "#F2F0FA" : "transparent",
                borderBottom: separatorIndex === index ? "10px solid #ccc" : "",
              }}
            >
              <TableCell component="th" scope="row">
                {entity.id.toString()}
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
                    onToggle(
                      entity.id.toString(),
                      toggledEntities.find((e) => e.id === entity.id.toString())
                        ?.value === "true" ?? false,
                      typeof entity.id === "number" ? "ACCOUNT" : "PROJECT"
                    )
                  }
                  checked={
                    toggledEntities.find((e) => e.id === entity.id.toString())
                      ?.value === "true" ?? false
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
