import { wait } from "../utils/wait";
import { ToggleFF, BasicFF, Account, Project } from "./types";

const API_BASE = "http://localhost:8009";
const ADMIN_API_BASE = "http://localhost:3000/api/v3/admin";

export type ScopeType = "BASIC" | "TOGGLE";

export const fetchEnvs = async (): Promise<(ToggleFF | BasicFF)[]> => {
  return await fetch(`${API_BASE}/env`).then(
    async (res) => (await res.json()) as (ToggleFF | BasicFF)[]
  );
};

export const fetchEntityDetails = async (type: string, id: string | number) => {
  return await fetch(`${API_BASE}/env-entity/entities/${id}?type=${type}`).then(
    async (res) => await res.json()
  );
};

export const updateEnv = async (
  key: string,
  body: { value: string; appliedTo: string }
) => {
  return await fetch(`${API_BASE}/env/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async () => {
    await wait(200); // Latency with the update
    return "ok";
  });
};

export const fetchEnvEntities = async (toggleKey: string) => {
  return await fetch(
    `${API_BASE}/env-entity/${encodeURIComponent(toggleKey)}`
  ).then(async (res) => (await res.json()) as any);
};
export interface EnvEntityBody {
  entityId: string | number;
  entityType: "PROJECT" | "ACCOUNT";
  value: "true" | "false";
  toggleSortKey: string;
}
export const postEnvEntity = async (envEntityBody: EnvEntityBody) => {
  console.log(envEntityBody);
  return await fetch(`${API_BASE}/env-entity`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([envEntityBody]),
  }).then(async (res) => {
    return "ok";
  });
};
export interface ScopeMetadata {
  name: string;
  type: ScopeType;
  options: { name: string; key: string }[];
}

export const fetchMetadata = async (): Promise<ScopeMetadata[]> => {
  return await fetch(`${API_BASE}/metadata`).then(async (res) => {
    const r = (await res.json()) as ScopeMetadata[];

    for (const meta of r) {
      if (meta.name === "Granular") {
        meta.options = [{ name: "GRANULAR", key: "GRANULAR" }];
      }
    }
    return r;
  });
};

export interface PostEnvBodyBase {
  secret: boolean;
  type: ScopeType;
  description: string;
  name: string;
}
export type PostEnvBodyToggle = PostEnvBodyBase & {
  type: "TOGGLE";
  toggle: {
    toggleType: "RELEASE_TOGGLE";
    applieTo: "GRANULAR";
  };
};
export type PostEnvBodyBasic = PostEnvBodyBase & {
  type: "BASIC";
  appliesTo: string;
  value: boolean | "true" | "false";
};

export type PostEnvBody = PostEnvBodyToggle | PostEnvBodyBasic;

export const postEnv = async (body: PostEnvBody): Promise<any> => {
  if (body.type === "BASIC") {
    body.value = body.value.toString() as "true" | "false";
  }
  return await fetch(`${API_BASE}/env`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (res) => await res.json());
};

export const fetchAccounts = async () => {
  return await fetch(`${ADMIN_API_BASE}/accounts`).then(
    async (res) => (await res.json()).accounts as Account[]
  );
};

export const fetchProjects = async () => {
  return await fetch(`${ADMIN_API_BASE}/projects`).then(
    async (res) => (await res.json()).projects as Project[]
  );
};
