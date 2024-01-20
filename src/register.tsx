import { Action, ActionPanel, Form, LocalStorage, Toast, getPreferenceValues, showToast } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import buildKey from "./lib/buildKey";
type ChannelInfo = {
  title: string;
  teamId: string;
  channelId: string;
};

type Preference = {
  defaultTeamID: string;
};

function make_url(teamId: string, channelId: string) {
  return `slack://channel?team=${teamId}&id=${channelId}`;
}

function getTitle(title: string) {
    return LocalStorage.getItem<string>(buildKey("slack", title));
}

export default function Command() {
  
  const { handleSubmit, itemProps } = useForm<ChannelInfo>({
    async onSubmit(values) {
      if (await getTitle(values.title)) {
        showToast({
          style: Toast.Style.Failure,
          title: "Channel already registered!",
        });
        return;
      }
      LocalStorage.setItem(buildKey("slack", values.title), make_url(values.teamId, values.channelId));
      showToast({
        style: Toast.Style.Success,
        title: "Channel Registered!",
      });
    },
    validation: {
      title: FormValidation.Required,
      teamId: FormValidation.Required,
      channelId: FormValidation.Required,
    },
  });
  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title="Register Channel" />
        </ActionPanel>
      }
    >
      <Form.TextField title="Title" placeholder="Enter the title" {...itemProps.title} />
      <Form.Description text="Title don't need to be the same as channnel name. Name it freely!" />
      <Form.Separator />
      <Form.TextField
        title="Team ID"
        placeholder="Enter the team ID"
        {...itemProps.teamId}
        value={getPreferenceValues<Preference>().defaultTeamID}
      />
      <Form.TextField title="Channel ID" placeholder="Enter the Channel ID" {...itemProps.channelId} />
    </Form>
  );
}
