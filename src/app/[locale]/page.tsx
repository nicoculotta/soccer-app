"use client";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import MatchCard from "@/components/MatchCard";
import Navbar from "@/components/Navbar/Navbar";
import { SheetModal } from "@/components/SheetModal/SheetModal";
import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/authContext";
import { createMatch, db, deleteMatch } from "@/lib/firebase";
import { formatDate, formatDayName, getDayName } from "@/utils/formatters";
import { Frown, MoveUpLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { uuidv4 } from "@firebase/util";
import { useLocale, useTranslations } from "next-intl";
import { iMatch } from "@/types/types";
import { collection, onSnapshot } from "firebase/firestore";
import { MatchProvider } from "@/context/matchContext";

export default function Home() {
  const t = useTranslations("homePage");
  const locale = useLocale();
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    await deleteMatch(id);
  };

  useEffect(() => {
    const collectionRef = collection(db, "matches");
    const unsubscribe = onSnapshot(collectionRef, (snap) => {
      const matches: iMatch[] = [];
      snap.docs.forEach((doc) => {
        matches.push(doc.data() as iMatch);
      });
      setMatches(matches);
    });

    return () => unsubscribe();
  }, []);

  if (loading && !user) return <HomeSkeleton />;

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-sm mx-auto px-2">
        <div className="grid grid-col gap-2 mt-4">
          <div>
            <SheetModal
              isAdmin={user.role !== "user"}
              button={
                <Button variant="outline" size={"sm"}>
                  <Plus className="mr-2 h-4 w-4" /> {t("createMatchButton")}
                </Button>
              }
            >
              <SheetHeader>
                <SheetTitle>{t("matchSettings")}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center gap-4">
                  <Label>{t("selectDate")} *</Label>
                  <DatePicker
                    date={date}
                    onChangeDate={setDate}
                    onBlurDate={() =>
                      setFormError({ ...formError, date: false })
                    }
                  />
                </div>
                <div className="grid items-center gap-4">
                  <Label>{t("selectTime")} *</Label>
                  <Input
                    type={"time"}
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
                    {t("createMatchButton")}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetModal>
          </div>
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 px-6 h-48 rounded-md">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 mb-3 ">
                <MoveUpLeft size={24} />
              </div>
              <h3 className="text-muted-foreground text-center">
                {t("emptyMatches")}
              </h3>
            </div>
          ) : (
            matches.map((match) => (
              <MatchCard
                key={match.id}
                matchId={match.id}
                date={match.date}
                title={`${formatDayName(match.day, locale)} ${match.time} hs`}
                role={user.role}
                onDelete={() => handleDeleteMatch(match.id)}
                creator={{
                  name: match.owner.name,
                  avatar: match.owner.avatar,
                }}
                isActive={match.available}
                ownerName={match.owner.name}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
