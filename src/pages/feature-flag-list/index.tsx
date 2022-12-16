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
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchMetadata } from "../../api";
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
const columns: readonly Column[] = [
  { id: "id", label: "Id", minWidth: 170, format: (v) => v },
  { id: "name", label: "Feature Flag Name", minWidth: 100, format: (v) => v },
  {
    id: "desc",
    label: "Feature Flag Description",
    minWidth: 170,
    align: "right",
    format: (v) => (
      <Tooltip title={v}>
        <Typography variant="body2">{truncateString(v, 15)}</Typography>
      </Tooltip>
    ),
  },
  {
    id: "scope",
    label: "Feature Flag Scope",
    minWidth: 170,
    align: "right",
    format: (v) => v,
  },
  {
    id: "created_at",
    label: "Created At",
    minWidth: 170,
    align: "right",
    format: (v) => v.toLocaleDateString(),
  },
  {
    id: "enabled",
    label: "Enabled",
    minWidth: 170,
    format: (v) => <Switch defaultChecked={v} />,
  },
  {
    id: "updated_at",
    label: "Updated At",
    minWidth: 170,
    format: (v) => v.toLocaleDateString(),
  },
];

const Scopes = ["EU_WEST_3", "GRANULAR", "US_EAST_1"];

function xDaysAgo(x: number) {
  const d = new Date();
  d.setDate(d.getDate() - x);
  return d;
}

interface Data {
  id: number;
  name: string;
  desc: string;
  scope: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

function createData(name: string): Data {
  return {
    id: faker.datatype.number({ min: 2000, max: 2200 }),
    name,
    desc: faker.lorem.paragraph(10),
    scope: Scopes[faker.datatype.number({ min: 0, max: Scopes.length - 1 })],
    enabled: !!faker.datatype.number({ min: 0, max: 1 }),
    created_at: faker.date.between(xDaysAgo(10), xDaysAgo(3)),
    updated_at: faker.date.between(xDaysAgo(3), xDaysAgo(0)),
  };
}

// createData(2300, "India", "IN", 1324171354, 3287263),
const rows = [
  createData("AUTHENTICATE_FIELDWIRE_VERSION_HEADER"),
  createData("CONNECTION_TIMEOUT_INFO_LOGS_ENABLED"),
  createData("DATABASE_SELECTOR_MIDDLEWARE_FOR_WORKERS_ENABLED"),
  createData("DISABLE_LEGACY_CONNECTION_HANDLING"),
  createData("DISABLE_NEW_CTS_PROJECT"),
  createData("DISABLE_S3_CONVER"),
  createData("DISABLE_SYNC_ERROR_TRACKIN"),
  createData("DISABLE_TRANSACTION_ADVISORY_LOC"),
  createData("DISABLE_USER_COMPANY_TYPE_VALIDATION"),
  createData("EMAIL_VERIFICATION_ENDPOINT_ENABLED"),
  createData("EMAIL_VERIFICATION_WORKER_ENABLED"),
  createData("ENABLE_API_FILTERS"),
  createData("ENABLE_API_PROBABILISTIC_COUNTING"),
  createData("ENABLE_API_RATE_LIMIT"),
  createData("ENABLE_AUTO_MARKUP_MIGRATION"),
  createData("ENABLE_AUTO_PHOTO_FLATTEN_WORKER"),
  createData(
    "ENABLE_BATCHING_FOR_PAYING_ACCOUNTS_LIFETIME_MODEL_COUNTS_WORKER"
  ),
  createData("ENABLE_CHUNKING_AND_UPSERTING_ENTITIES_TO_D"),
  createData("ENABLE_CIRCUIT_BREAKE"),
  createData("ENABLE_CLEAR_ACTIVE_CONNECTIONS_ON_BOO"),
  createData("ENABLE_CLIENT_API_PROXY_TO_SUPER"),
  createData("ENABLE_COLLECT_STRIPE_CUSTOMER_LOCATION"),
  createData("ENABLE_CONCURRENCY_FOR_AUTOMATIC_HYPERLINKS_SHEET_PROCESSIN"),
  createData("ENABLE_CONCURRENCY_FOR_FULL_SIZE_PLAN"),
  createData("ENABLE_COUNTER_RATE_LIMIT"),
  createData("ENABLE_DROPBOX_SHORT_LIVE_TOKE"),
  createData("ENABLE_ELASTICSEARCH_BRUTEFORCE_TIMEOU"),
];
const searchableRows = new Fuse(rows, { keys: ["name"], includeMatches: true });

const filterRows = (options: {
  name: string;
  scope: string | "ALL";
}): Data[] => {
  const res =
    options.name.length > 0
      ? searchableRows.search(options.name).map((res) => res.item)
      : rows;
  if (options.scope.length > 0 && options.scope !== "ALL") {
    return res.filter((i) => i.scope === options.scope);
  } else {
    return res;
  }
};

export default function FeatureFlagsList() {
  const [queryName, setQueryName] = useState("");
  const [filterScope, setFilterScope] = useState("");
  const data = filterRows({
    name: queryName,
    scope: filterScope,
  });
  const { isLoading: metadataLoading, data: metadata } = useQuery(
    "metadatas",
    fetchMetadata,
    {
      onSuccess(data) {
        setFilterScope("ALL");
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
            Feature Flags
          </Typography>
        </Box>
        <Box>
          <Button component={Link} variant="contained" to="new">
            Create New
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ display: "flex" }}>
          <Box pt={5} pb={2} pl={2}>
            <TextField
              id="outlined-read-only-input"
              label="Filter by name"
              value={queryName}
              onChange={(e) => setQueryName(e.currentTarget.value)}
            />
          </Box>
          <Box pt={5} pb={2} pl={2}>
            <FormControl sx={{ minWidth: 200 }} disabled={metadataLoading}>
              <InputLabel id="demo-simple-select-label">Scope</InputLabel>
              <Select
                value={filterScope}
                label="Scope"
                onChange={(v) => setFilterScope(v.target.value)}
              >
                {metadata?.scopes.map((m) => (
                  <MenuItem key={m.key} value={m.key}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                    {columns.map((column) => {
                      const value = item[column.id as keyof typeof item];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
