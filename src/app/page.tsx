"use client";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import MatchCard from "@/components/MatchCard";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import Navbar from "@/components/Navbar/Navbar";
import UserMenu from "@/components/Navbar/UserMenu";
import { SelectScrollable } from "@/components/SelectScrollable/SelectScrollable";
import { SheetModal } from "@/components/SheetModal/SheetModal";
import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/authContext";
import { createMatch, deleteMatch, getAllMatches } from "@/lib/firebase";
import { iMatch } from "@/lib/schemaFirebase";
import { formatDate, getDayName } from "@/utils/formatters";
import { Plus, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";

export default function Home() {
  const { user, loading } = useAuth();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [formError, setFormError] = useState({
    date: true,
    time: true,
  });

  const [matches, setMatches] = useState<iMatch[] | []>([]);

  const handleCreateMatch = async () => {
    const newMatch = {
      id: uuidv4(),
      day: getDayName(date),
      date: formatDate(date),
      time,
      available: false,
      playerList: [],
      owner: user,
    };

    try {
      const match = await createMatch(newMatch);
      setMatches([...matches, match.data]);
      return console.log(match);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    await deleteMatch(id);
    await fetchAllMatches();
  };

  const fetchAllMatches = async () => {
    const response = await getAllMatches();
    setMatches(response);
  };

  useEffect(() => {
    fetchAllMatches();
  }, []);

  if (loading && !user) return <HomeSkeleton />;

  if (!user) {
    return null;
  }

  console.log(matches);

  return (
    <>
      <Navbar>
        <div className="flex gap-2">
          <Trophy />
          <span className="font-medium">Fútbol El Palo</span>
        </div>
        <div className="grid gap-4 grid-cols-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </Navbar>
      <main className="max-w-sm mx-auto px-2">
        <div className="grid grid-col gap-2 mt-4">
          <div>
            <SheetModal
              isAdmin={user.role !== "user"}
              button={
                <Button variant="outline" size={"sm"}>
                  <Plus className="mr-2 h-4 w-4" /> Create Match
                </Button>
              }
            >
              <SheetHeader>
                <SheetTitle>Match Settings</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-4">
                  <Label>Select Date *</Label>
                  <DatePicker
                    date={date}
                    onChangeDate={setDate}
                    onBlurDate={() =>
                      setFormError({ ...formError, date: false })
                    }
                  />
                </div>
                <div className="grid items-center gap-4">
                  <Label>Select Time *</Label>
                  <Input
                    type={"time"}
                    placeholder="Select Time"
                    onChange={(e) => setTime(e.target.value)}
                    onBlur={() =>
                      time && setFormError({ ...formError, time: false })
                    }
                    value={time}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="submit"
                    onClick={handleCreateMatch}
                    disabled={
                      formError.date === true || formError.time === true
                    }
                  >
                    Create Match
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetModal>
          </div>

          {matches &&
            matches.map((match) => (
              <MatchCard
                key={match.date + match.time}
                date={match.date}
                title={`${match.day} ${match.time} hs`}
                role={user.role}
                onDelete={() => handleDeleteMatch(match.id)}
                creator={{ name: match.owner.name, avatar: match.owner.avatar }}
              />
            ))}
        </div>
      </main>
    </>
  );
}
