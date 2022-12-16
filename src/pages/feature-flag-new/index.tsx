import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { fetchMetadata } from "../../api";

interface Inputs {
  name: string;
  desc: string;
  scope: string;
}
const INPUT_MIN_WIDTH = 500;
export default function FeatureFlagsNew() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      desc: "",
      scope: "",
    },
  });
  const [filterScope, setFilterScope] = useState("");
  const { isLoading: metadataLoading, data: metadata } = useQuery(
    "metadatas",
    fetchMetadata,
    {
      onSuccess() {
        setValue("scope", "ALL");
      },
    }
  );
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box pl={2} py={5} component="form" onSubmit={handleSubmit(onSubmit)}>
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
                    {metadata?.scopes.map((m) => (
                      <MenuItem key={m.key} value={m.key}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Button type="submit">Submit</Button>
      </Box>
    </Paper>
  );
}
