import RegisterBase from "./components/RegisterBase";

const appName = "notion";
const urlComponentKeys = ["workspace", "page"] as const;
type NotionUrlComponentKey = typeof urlComponentKeys[number];

const buildUrl = ({workspace, page} : { [key in NotionUrlComponentKey]: string }) => {
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
