# Quick Any

Open specified page in any application quickly (via raycast).

## Adding new application support.
1. Add icon (`assets/xxx-icon.png`)
2. Add `src/xxxOpen.tsx` and `src/xxxRegister.tsx` files.
```typescript
/* example with Notion. */

/* src/xxxOpen.tsx */
import OpenBase from "./components/OpenBase";

export default function Command() {
  return <OpenBase appName="notion" iconPath="notion-icon.png" />;
}

/* src/xxxRegister.tsx */
import RegisterBase from "./components/RegisterBase";

const appName = "notion";
// define components of ID that specifies unique page.
const urlComponentKeys = ["workspace", "page"] as const;
type NotionUrlComponentKey = typeof urlComponentKeys[number];

const buildUrl = ({workspace, page} : { [key in NotionUrlComponentKey]: string }) => {
  // Build local url from components
  return `notion://${workspace}/${page}`;
}

export default function Command() {
  return (
    <RegisterBase<NotionUrlComponentKey>
      appName={appName}
      buildUrl={buildUrl}
      urlComponentKeys={urlComponentKeys}
    />
  )
}
```
3. Add configs to `package.json`.