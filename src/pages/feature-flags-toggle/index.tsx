import {
  Box,
  Typography,
  Button,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  EnvEntityBody,
  fetchAccounts,
  fetchEnvEntities,
  fetchEnvs,
  fetchProjects,
  postEnvEntity,
} from "../../api";
import { ToggleFF } from "../../api/types";
import EntityTable from "../feature-flag-new/entities-table";

export default function FeatureFlagsToggles() {
  let { toggleKey } = useParams();
  const [filterType, setFilterType] = useState("ALL");

  const {
    isLoading: entityLoading,
    data: envEntity,
    refetch: refetchEntities,
  } = useQuery(`entity${toggleKey}`, () =>
    toggleKey ? fetchEnvEntities(toggleKey) : Promise.reject()
  );
  const mutation = useMutation((data: EnvEntityBody) => postEnvEntity(data), {
    onSuccess() {
      refetchEntities();
    },
  });
  const { isLoading: envFetching, data: env } = useQuery("envs", fetchEnvs, {
    select: (data) =>
      data.find(
        (v) => v.type === "TOGGLE" && v.toggle.toggleSortKey === toggleKey
      ) as ToggleFF,
  });
  const { isLoading: projectsLoading, data: projects } = useQuery(
    "projects",
    fetchProjects
  );

  const { isLoading: accountsLoading, data: accounts } = useQuery(
    "accounts",
    fetchAccounts
  );
  if (envFetching || entityLoading || !env) return <div>loading</div>;
  const entities =
    filterType === "ALL"
      ? [...(accounts ?? []), ...(projects ?? [])]
      : filterType === "PROJECTS"
      ? [...(projects ?? [])]
      : [...(accounts ?? [])];

  return (
    <>
      <Box
        display="flex"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography pb={5} fontWeight="bold" variant="h4" component="h4">
            {env!.name}
          </Typography>
        </Box>
      </Box>
      {!!accounts && !!projects && (
        <Box py={3} px={2} component={Paper}>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => setFilterType(e.currentTarget.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel
              value="ACCOUNTS"
              control={<Radio />}
              label="Accounts"
            />
            <FormControlLabel
              value="PROJECTS"
              control={<Radio />}
              label="Projects"
            />
          </RadioGroup>
          <EntityTable
            onToggle={(id, remove) => {
              mutation.mutate({
                entityId: id,
                entityType: typeof id === "string" ? "PROJECT" : "ACCOUNT",
                value: "true",
                toggleSortKey: toggleKey!,
              });
            }}
            toggledEntities={envEntity.map((e: any) => e.entityId)}
            entities={entities}
          />
        </Box>
      )}
    </>
  );
}
