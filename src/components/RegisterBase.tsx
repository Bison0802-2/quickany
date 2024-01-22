import { Action, ActionPanel, Form, LocalStorage, Toast, getPreferenceValues, showToast } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";

import { pascalCase } from "change-case";
import buildKey from "../lib/buildKey";



type Preference = {
  [key: string]: string;
};

type RegisterBaseProps<T extends string> = {
  appName: string;
  buildUrl: (urlComponents: Record<T, string>) => string;
  urlComponentKeys: readonly T[];
}

const RegisterBase = <T extends string>({
  appName,
  urlComponentKeys,
  buildUrl
}: RegisterBaseProps<T>) => {
  type PageInfo = {
    title: string;
    [key: string]: string;
  };

  const getTitle = (appName: string, title: string) => {
    return LocalStorage.getItem<string>(buildKey(appName, title));
  }

  const setUrl = (appName: string, {title, ...urlComponents}: PageInfo) => {
    LocalStorage.setItem(
      buildKey(appName, title),
      // Diffucult to strictlly type this
      buildUrl(urlComponents as any as Record<T, string>)
    );
  };

  const buildValidation = (urlComponentKeys: readonly T[]) => {
    let validations: {title: FormValidation, [key: string]: FormValidation} = { title: FormValidation.Required };
    for (let key of urlComponentKeys) {
      validations[key] = FormValidation.Required;
    }
    return validations;
  }

  const { handleSubmit, itemProps } = useForm<PageInfo>({
    async onSubmit(values) {
      if (await getTitle(appName, values.title)) {
        showToast({
          style: Toast.Style.Failure,
          title: "Page already registered!",
        });
        return;
      }
      setUrl(appName, values);
      showToast({
        style: Toast.Style.Success,
        title: "Page Registered!",
      });
    },
    validation: buildValidation(urlComponentKeys),
  });

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title="Register Page" />
        </ActionPanel>
      }
    >
      <Form.TextField title="Title" placeholder="Enter the title" {...itemProps.title} />
      <Form.Description text="Title don't need to be the same as channnel name. Name it freely!" />
      <Form.Separator />
      {
        urlComponentKeys.map((key) => {
            const preference = getPreferenceValues<Preference>();
            return (
              <Form.TextField
                key={key}
                title={pascalCase(key) + " ID"}
                placeholder={`Enter the ${pascalCase(key)} ID`}
                {...itemProps[key]}
                value={key in preference ? preference[key] : undefined}
              />
            );
          })
      }
    </Form>
  );
}

export default RegisterBase;