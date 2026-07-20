import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/afstim/card";

const COPY = {
  PENDING: {
    title: "You're on the list",
    body: "We're opening access in small groups. You'll get an email.",
  },
  REVOKED: {
    title: "Your access has been paused",
    body: "You'll hear from us if that changes.",
  },
} as const;

export default async function PendingPage() {
  const session = await auth();
  const status = session?.user.accessStatus === "REVOKED" ? "REVOKED" : "PENDING";
  const copy = COPY[status];

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-16 sm:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-[1.65] text-muted">{copy.body}</p>
        </CardContent>
      </Card>
    </div>
  );
}
