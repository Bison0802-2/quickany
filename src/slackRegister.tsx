import RegisterBase from "./components/RegisterBase";

const appName = "slack";
const urlComponentKeys = ["team", "channel"] as const;
type SlackUrlComponentKey = typeof urlComponentKeys[number];

const buildUrl = ({team, channel} : { [key in SlackUrlComponentKey]: string }) => {
  return `slack://channel?team=${team}&id=${channel}`;
}

export default function Command() {
  return (
    <RegisterBase<SlackUrlComponentKey>
      appName={appName}
      buildUrl={buildUrl}
      urlComponentKeys={urlComponentKeys}
    />
  )
}
