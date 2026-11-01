import type { Metadata } from "next";
import { brand } from "@/brand";
import { PublicLanding } from "@/components/request/public-landing";

export const metadata: Metadata = {
  title: { absolute: brand.name },
  description: brand.description,
};

export default function PublicRequestPage() {
  return <PublicLanding />;
}
