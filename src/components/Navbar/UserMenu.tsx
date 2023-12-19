"use client";
import { USER_ROLES } from "@/config";
import { useAuth } from "@/context/authContext";
import { Languages, LayoutDashboard, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const locale = useLocale();
  const t = useTranslations("userNavigation");
  const { push } = useRouter();
  const pathname = usePathname();

  const switchLang = () => {
    const restOfPathname = pathname.slice(3);
    locale === "en"
      ? push(`/es${restOfPathname}`)
      : push(`/en${restOfPathname}`);
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-4">
        <DropdownMenuGroup>
          {(user.role === USER_ROLES.IS_ADMIN ||
            user.role === USER_ROLES.IS_SUPER) && (
            <Link href={`/${locale}/admin`}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t("dashboard")}</span>
              </DropdownMenuItem>
            </Link>
          )}

          <DropdownMenuItem onClick={switchLang}>
            <Languages className="mr-2 h-4 w-4" />
            <span>{t("language")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("signOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
