const API_BASE = "http://localhost:8009";

interface FormatedMetadata {
    env_types: { name: string; key: string }[];
    scopes: { name: string; key: string }[];
    toggle_types: { name: string; key: string }[];
  }

  
function formatMetadata(data: any) {
    const formated: FormatedMetadata = {} as any;
    for (const metaTypeKey of Object.keys(data)) {
      for (const key of Object.keys(data[metaTypeKey])) {
        if (formated[metaTypeKey as keyof typeof formated]) {
          formated[metaTypeKey as keyof typeof formated].push({
            key,
            name: data[metaTypeKey][key],
          });
        } else {
          formated[metaTypeKey as keyof typeof formated] = [
            { key, name: data[metaTypeKey][key] },
          ];
        }
      }
    }
    return formated;
  }

export const fetchMetadata = async () => {
  return await fetch(`${API_BASE}/metadata`).then(async (r) => formatMetadata(await r.json()));
};
