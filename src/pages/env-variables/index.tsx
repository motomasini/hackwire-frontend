import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { faker } from "@faker-js/faker";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Link as MuiLink,
  IconButton,
  InputBase,
} from "@mui/material";
import { ReactNode, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { fetchEnvs, fetchMetadata, updateEnv } from "../../api";
import { ToggleFF, BasicFF } from "../../api/types";
import EditIcon from "@mui/icons-material/Edit";
import { TextFields } from "@mui/icons-material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
faker.seed(123);

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format: (value: any) => string | ReactNode;
}
function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export default function EnvVariables() {
  const searchRef = useRef(
    new Fuse<ToggleFF | BasicFF>([], { keys: ["name"] })
  );

  const [queryName, setQueryName] = useState("");
  const [filterScope, setFilterScope] = useState("");
  const {
    isLoading: envFetching,
    data: envs,
    refetch: refetchEnvs,
  } = useQuery("envs", fetchEnvs, {
    select(data) {
      return data.filter((v) =>
        v.type === "TOGGLE" ? false : !["true", "false"].includes(v.value)
      );
    },
    onSuccess(data) {
      searchRef.current.setCollection([...data]);
    },
  });
  const mutation = useMutation(
    (data: { key: string; body: { appliedTo: string; value: string } }) =>
      updateEnv(data.key, data.body),
    {
      onSuccess(data, variables, context) {
        refetchEnvs();
      },
    }
  );
  const filterRows = (options: {
    name: string;
    scope: string | "ALL";
  }): (ToggleFF | BasicFF)[] => {
    const res =
      options.name.length > 0
        ? searchRef.current.search(options.name).map((res) => res.item)
        : [...(envs ?? [])];
    if (options.scope.length > 0 && options.scope !== "GRANULAR") {
      return res.filter(
        (i) => i.type === "BASIC" && i.appliesTo === options.scope
      );
    } else if (options.scope.length > 0) {
      return res.filter((i) => i.type === "TOGGLE");
    } else {
      return res;
    }
  };
  const data = filterRows({
    name: queryName,
    scope: filterScope,
  });
  const { isLoading: metadataLoading, data: metadata } = useQuery(
    "metadatas",
    fetchMetadata,
    {
      select(data) {
        return data.filter((m) => m.name !== "Granular");
      },
    }
  );
  return (
    <>
      <Box
        display="flex"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography pb={5} fontWeight="bold" variant="h2" component="h2">
            Env Variable
          </Typography>
        </Box>
        <Box>
          <Button
            style={{ marginLeft: 10 }}
            component={Link}
            variant="contained"
            to="new"
          >
            Create New
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ display: "flex" }}>
          <Box pt={5} pb={2} pl={2}>
            <TextField
              size="small"
              label="Filter by name"
              value={queryName}
              onChange={(e) => setQueryName(e.currentTarget.value)}
            />
          </Box>
          <Box pt={5} pb={2} pl={2}>
            <FormControl
              size="small"
              sx={{ minWidth: 200 }}
              disabled={metadataLoading}
            >
              <InputLabel>Scope</InputLabel>
              <Select
                value={filterScope}
                label="Scope"
                onChange={(v) => setFilterScope(v.target.value)}
              >
                {[
                  { name: null, options: [{ name: "None", key: "" }] },
                  ...(metadata ?? []),
                ].map((m) => {
                  return [
                    m.name ? <ListSubheader>{m.name}</ListSubheader> : null,
                    m.options.map((o) => (
                      <MenuItem
                        key={o.name}
                        value={o.name === "None" ? "" : o.name}
                      >
                        {o.name}
                      </MenuItem>
                    )),
                  ];
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Desc
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Scope
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Created At
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  Value
                </TableCell>
                <TableCell align="left" style={{ minWidth: 100 }}>
                  History
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map((item) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={`${item.key}_${item.createdAt}`}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Tooltip title={item.description}>
                      <Typography variant="body2">
                        {truncateString(item.description ?? "", 20)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {item.type === "BASIC"
                      ? item.appliesTo
                      : item.toggle.appliesTo}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt * 1000).toUTCString()}
                  </TableCell>
                  <TableCell>
                    {item.type === "BASIC" && (
                      <FieldWithSubmit
                        value={item.value}
                        onSubmit={(value: string) =>
                          mutation.mutate({
                            key: item.key,
                            body: {
                              appliedTo: item.appliesTo,
                              value,
                            },
                          })
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <MuiLink component={Link} to={`/history/${item.name}`}>
                      history
                    </MuiLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

function FieldWithSubmit({ value, onSubmit }: any) {
  const [fieldValue, setFieldValue] = useState(value);
  return (
    <>
      <InputBase
        sx={{ ml: 1, flex: 1, backgroundColor: "#f5f5f5", py: 1, px: 2 }}
        value={fieldValue}
        onChange={(e) => setFieldValue(e.currentTarget.value)}
      />
      <IconButton
        onClick={() => onSubmit(fieldValue)}
        type="button"
        sx={{ p: 0 }}
        color="primary"
      >
        <KeyboardReturnIcon />
      </IconButton>
    </>
  );
}
