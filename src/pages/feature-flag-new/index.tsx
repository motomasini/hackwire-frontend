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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  fetchAccounts,
  fetchMetadata,
  fetchProjects,
  postEnv,
  PostEnvBody,
  ScopeMetadata,
  ScopeType,
} from "../../api";
import { removeDiacritics } from "../../utils/remove_diacritics";
import { redirect, useNavigate } from "react-router-dom";
interface EntityInput {
  entityType: "PROJECT" | "ACCOUNT";
  id: string | number;
}
interface Inputs {
  name: string;
  desc: string;
  scope: string;
  value: boolean;
  //   entities: EntityInput[];
}
const INPUT_MIN_WIDTH = 500;

interface MetadataTypeByKey {
  [key: string]: ScopeType;
}

function mapMetadataTypes(metadatas: ScopeMetadata[]) {
  return metadatas.reduce((carry, metadata) => {
    for (const op of metadata.options) {
      carry[op.name] = metadata.type;
    }
    return carry;
  }, {} as MetadataTypeByKey);
}

function namify(str: string) {
  const underscoreChars = [" ", "-", "(", ")"];
  if (underscoreChars.includes(str[str.length - 1])) {
    return `${str.slice(0, -1)}_`;
  } else {
    return removeDiacritics(str).toUpperCase();
  }
}
export default function FeatureFlagsNew() {
  const navigate = useNavigate();
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
      //   entities: [],
    },
  });
  const mutation = useMutation((data: PostEnvBody) => postEnv(data), {
    onSuccess(data, variables, context) {
      if (variables.type === "BASIC") {
        console.log("sould redirect");
        navigate("/feature-flags");
      } else {
        console.log("sould redirect");
        navigate(
          `/feature-flags/toggles/${encodeURIComponent(data.toggleSortKey)}`
        );
      }
      //   console.log(data, variables, context);
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
  //   const entities = watch("entities");

  //   const currentEntityType = useRef({ lastEntityType: scope });

  //   if (currentEntityType.current.lastEntityType !== scope) {
  //     setValue("entities", []);
  //     currentEntityType.current.lastEntityType = scope;
  //   }

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData.scope);
    const type = mapMetadataTypes(metadata!)[formData.scope];
    const data: Partial<PostEnvBody> = {
      name: formData.name,
      description: formData.desc,
      secret: false,
      type,
    };
    if (data.type === "BASIC") {
      data.value = formData.value;
      data.appliesTo = formData.scope;
    } else if (data.type === "TOGGLE") {
      data.toggle = {
        toggleType: "RELEASE_TOGGLE",
        applieTo: "GRANULAR",
      };
    }
    mutation.mutate(data as PostEnvBody);
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
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(namify(e.currentTarget.value))
                    }
                    sx={{ minWidth: INPUT_MIN_WIDTH }}
                    required
                    label="Name"
                  />
                )}
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
                            <MenuItem key={o.key} value={o.name}>
                              {o.name}
                            </MenuItem>
                          )),
                        ];
                      })}
                    </Select>
                  </FormControl>
                )}
              />
              {metadata && mapMetadataTypes(metadata)[scope] === "BASIC" && (
                <Grid item py={2}>
                  <FormControlLabel
                    control={<Switch {...register("value")} />}
                    label="Value"
                    labelPlacement="start"
                  />
                </Grid>
              )}
            </Grid>
            {/* {["ACCOUNT", "PROJECT"].includes(scope) && accounts && projects && (
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
            )} */}
          </Grid>
          <Box py={5}>
            <Button
              disabled={!metadata && isValid}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
