import { Action, ActionPanel, List, LocalStorage, closeMainWindow, confirmAlert } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { exec } from "child_process";
import { useEffect, useState } from "react";

type ChannelUrl = {
  [key: string]: string;
};

export default function Command() {
  const channelStorage = usePromise(async () => await LocalStorage.allItems<ChannelUrl>(), []);
  const channels = channelStorage.data;
  const [titleList, setTitleList] = useState(channels ? Object.keys(channels) : []);
  const [searchText, setSearchText] = useState<string | undefined>();
  const [filteredList, filterList] = useState(titleList);

  useEffect(() => {
    filterList(titleList.filter((title) => (searchText ? title.includes(searchText) : true)));
  }, [searchText]);

  useEffect(() => {
    if (channels) {
      setTitleList(Object.keys(channels));
    }
  }, [channels]);

  return (
    <List filtering={false} onSearchTextChange={setSearchText} searchBarPlaceholder="Search Channels">
      {filteredList.map((title: string) => (
        <List.Item
          key={title}
          title={title}
          subtitle={channels ? channels[title] : ""}
          actions={
            <ActionPanel>
              <Action
                title="Select"
                onAction={() => {
                  const url = channels ? channels[title] : "";
                  exec(`open "${url}"`);
                  closeMainWindow({ clearRootSearch: true });
                }}
              />
              <Action
                title="Detele"
                onAction={async () => {
                  if (
                    await confirmAlert({ title: `Are you sure you want to delete registration of channel "${title}"?` })
                  ) {
                    LocalStorage.removeItem(title);

                    const newTitleList = titleList.filter((item) => item !== title);
                    filterList(() => newTitleList);
                    setTitleList(newTitleList);
                  }
                }}
                shortcut={{ modifiers: ["cmd"], key: "d" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
