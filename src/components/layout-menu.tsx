import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
export const mainListItems = (withEnv = false) => (
  <React.Fragment>
    {/* <ListItemButton component={Link} to={"/"}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Envs" />
    </ListItemButton> */}
    <ListItemButton component={Link} to={"/feature-flags"}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Feature Flags" />
    </ListItemButton>
    {withEnv && (
      <ListItemButton component={Link} to={"/envvar"}>
        <ListItemIcon>
          <CardGiftcardIcon />
        </ListItemIcon>
        <ListItemText primary="Env Variables" />
      </ListItemButton>
    )}
    <ListItemButton component={Link} to={"/accounts"}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Accounts" />
    </ListItemButton>
    <ListItemButton component={Link} to={"/projects"}>
      <ListItemIcon>
        <WorkIcon />
      </ListItemIcon>
      <ListItemText primary="Projects" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = <React.Fragment></React.Fragment>;
