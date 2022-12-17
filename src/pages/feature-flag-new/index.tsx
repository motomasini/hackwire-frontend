import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import {
  fetchAccounts,
  fetchMetadata,
  fetchProjects,
  ScopeMetadata,
  ScopeType,
} from "../../api";
import EntityTable from "./entities-table";

interface EntityInput {
  entityType: "PROJECT" | "ACCOUNT";
  id: string | number;
}
interface Inputs {
  name: string;
  desc: string;
  scope: string;
  value: boolean;
  entities: EntityInput[];
}
const INPUT_MIN_WIDTH = 500;

interface MetadataTypeByKey {
  [key: string]: ScopeType;
}

function mapMetadataTypes(metadatas: ScopeMetadata[]) {
  return metadatas.reduce((carry, metadata) => {
    for (const op of metadata.options) {
      carry[op.key] = metadata.type;
    }
    return carry;
  }, {} as MetadataTypeByKey);
}

export default function FeatureFlagsNew() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      desc: "",
      scope: "",
      value: false,
      entities: [],
    },
  });
  const { isLoading: metadataLoading, data: metadata } = useQuery(
    "metadatas",
    fetchMetadata,
    {
      onSuccess() {
        setValue("scope", "ALL");
      },
    }
  );

  const { isLoading: projectsLoading, data: projects } = useQuery(
    "projects",
    fetchProjects
  );

  const { isLoading: accountsLoading, data: accounts } = useQuery(
    "accounts",
    fetchAccounts
  );
  const scope = watch("scope");
  const entities = watch("entities");

  const currentEntityType = useRef({ lastEntityType: scope });

  if (currentEntityType.current.lastEntityType !== scope) {
    setValue("entities", []);
    currentEntityType.current.lastEntityType = scope;
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  
  return (
    <>
      <Box>
        <Typography pb={5} fontWeight="bold" variant="h2" component="h2">
          Feature Flags
        </Typography>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box pl={2} py={5} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box py={5}>
            <Button disabled={!metadata && isValid} variant="contained" type="submit">
              Submit
            </Button>
          </Box>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register("name")}
                sx={{ minWidth: INPUT_MIN_WIDTH }}
                required
                label="Name"
                defaultValue=""
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ minWidth: INPUT_MIN_WIDTH }}
                {...register("desc")}
                label="Description"
                multiline
                required
                rows={4}
                defaultValue=""
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="scope"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    sx={{ minWidth: INPUT_MIN_WIDTH }}
                    disabled={metadataLoading}
                  >
                    <InputLabel>Scope</InputLabel>
                    <Select {...field} label="Scope">
                      {metadata?.map((m) => {
                        return [
                          <ListSubheader>{m.name}</ListSubheader>,
                          m.options.map((o) => (
                            <MenuItem key={o.key} value={o.key}>
                              {o.name}
                            </MenuItem>
                          )),
                        ];
                      })}
                    </Select>
                  </FormControl>
                )}
              />
              {metadata && mapMetadataTypes(metadata)[scope] === "basic" && (
                <Grid item py={2}>
                  <FormControlLabel
                    control={<Switch {...register("value")} />}
                    label="Value"
                    labelPlacement="start"
                  />
                </Grid>
              )}
            </Grid>
            {["ACCOUNT", "PROJECT"].includes(scope) && accounts && projects && (
              <EntityTable
                type={scope as any}
                toggledEntities={entities.map((e) => e.id)}
                entities={scope === "ACCOUNT" ? accounts : projects}
                onToggle={(id, remove) => {
                  if (!remove) {
                    setValue("entities", [
                      ...entities,
                      { entityType: scope as any, id },
                    ]);
                  } else {
                    setValue(
                      "entities",
                      entities.filter((e) => e.id !== id)
                    );
                  }
                }}
              />
            )}
          </Grid>
        </Box>
      </Paper>
    </>
  );
}
