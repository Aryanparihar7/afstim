import { auth } from "@/auth";
import { Button } from "@/components/afstim/button";
import { logoutUser } from "@/features/auth/services/login-service";

async function UserMenu() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[13px] text-muted">
        {session.user.email}
      </span>
      <form action={logoutUser}>
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </div>
  );
}

export { UserMenu };
