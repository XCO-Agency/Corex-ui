import { Page } from "@xco-agency/corex-ui";
import * as React from "react";
import { VideoTutorialCard } from "../VideoTutorialCard";

export function VideoTutorialExample() {
  return (
    <Page
      heading="Tutorials"
      subtitle="Learn how to get the most out of the app."
      inlineSize="large"
    >
      <VideoTutorialCard />
    </Page>
  );
}
