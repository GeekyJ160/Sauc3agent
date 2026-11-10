import { createFileRoute } from "@tanstack/react-router";
import { Sauc3App } from "@/components/sauc3/app";

export const Route = createFileRoute("/")({
  component: Sauc3App,
});
