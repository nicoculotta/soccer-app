"use client";
import { USER_ROLES } from "@/config";
import { useAuth } from "@/context/authContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-4">
        <DropdownMenuGroup>
          {(user.role === USER_ROLES.IS_ADMIN ||
            user.role === USER_ROLES.IS_SUPER) && (
            <Link href={"/admin"}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
