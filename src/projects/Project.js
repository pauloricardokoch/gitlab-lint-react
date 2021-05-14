// Copyright (c) 2021, Marcelo Jorge Vieira
// Licensed under the BSD 3-Clause License

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Divider,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";

import GitlabLintHttpClient from "../GitlabLintHttpClient";
import Loading from "../Loading";
import RuleTitle from "../rules/RuleTitle";
import ProjectTitle from "./ProjectTitle";

const Project = () => {
  const [rows, setData] = useState({});
  const { id } = useParams();
  const fetchData = () => {
    GitlabLintHttpClient("GET_ONE", { entity: "projects", id: id })
      .then((data) => {
        setData(data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (Object.keys(rows).length === 0 && rows.constructor === Object) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/projects">
          Projects
        </Link>
        <Typography color="textPrimary">
          {rows.project.name_with_namespace}
        </Typography>
      </Breadcrumbs>

      <Box pt={2} pb={2}>
        <Divider />
      </Box>

      <ProjectTitle project={rows.project} />
      <p>{rows.project.description}</p>

      <p>
        <strong>URL</strong>:{" "}
        <Link target="_blank" href={rows.project.web_url}>
          {rows.project.web_url}
        </Link>
      </p>
      <p>
        <strong>Clone with SSH</strong>: {rows.project.ssh_url_to_repo}
      </p>
      <p>
        <strong>Clone with HTTPS</strong>: {rows.project.http_url_to_repo}
      </p>

      <Box pt={2} pb={2}>
        <Divider />
      </Box>

      <Typography variant="h6" paragraph>
        This repository in the gitlab trigger {rows.rules.length} rules:
      </Typography>
      <List>
        {rows.rules.map((rule) => {
          return (
            <ListItem
              key={rule.ruleId}
              button
              component="a"
              href={`/rules/${rule.ruleId}`}
            >
              <RuleTitle rule={rule} size="small" />
            </ListItem>
          );
        })}
      </List>
    </React.Fragment>
  );
};

export default Project;
