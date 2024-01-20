import { Action, ActionPanel, List, LocalStorage, closeMainWindow, confirmAlert } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { exec } from "child_process";
import { useEffect, useState } from "react";

type UrlComponents = {
  [key: string]: string;
};

function isSubsequenseOf(quety: string, target: string) {
  const queryLower = quety.toLowerCase();
  const targetLower = target.toLowerCase();
  let q_i = 0;
  for (let t_i = 0; t_i < targetLower.length && q_i < queryLower.length; t_i++) {
    if (queryLower[q_i] === targetLower[t_i]) {
      q_i++;
    }
  }
  return q_i === queryLower.length;
}

type OpenBaseProps = {
  appName: string;
  iconPath?: string;
}

const OpenBase = ({
  iconPath,
  appName
}: OpenBaseProps) => {
  const iconSourcePath = iconPath ? iconPath : "command-icon.png";
  const pageStorage = usePromise(async () => await LocalStorage.allItems<UrlComponents>(), []);
  const pages = pageStorage.data;
  const [titleList, setTitleList] = useState(pages && appName in Object.keys(pages) ? Object.keys(pages[appName]) : []);
  const [searchText, setSearchText] = useState<string | undefined>();
  const [filteredList, filterList] = useState(titleList);


  useEffect(() => {
    filterList(titleList.filter((title) => (searchText ? isSubsequenseOf(searchText, title) : true)));
  }, [searchText]);

  useEffect(() => {
    if (pages) {
      setTitleList(Object.keys(pages));
    }
  }, [pages]);

  return (
    <List filtering={false} onSearchTextChange={setSearchText} searchBarPlaceholder="Search Pages">
      {filteredList.map((title: string) => (
        <List.Item
          key={title}
          title={title}
          subtitle={pages ? pages[title] : ""}
          icon={{ source: iconSourcePath }}
          actions={
            <ActionPanel>
              <Action
                title="Select"
                onAction={() => {
                  const url = pages ? pages[title] : "";
                  exec(`open "${url}"`);
                  closeMainWindow({ clearRootSearch: true });
                }}
              />
              <Action
                title="Detele"
                onAction={async () => {
                  if (
                    await confirmAlert({ title: `Are you sure you want to delete registration of page "${title}"?` })
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
export default OpenBase;