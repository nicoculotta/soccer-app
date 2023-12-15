import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";
import { useLocale, useTranslations } from "next-intl";
import { es, enUS } from "date-fns/locale";

interface iDatePicker {
  date: Date | undefined;
  onChangeDate: Dispatch<SetStateAction<Date | undefined>>;
  onBlurDate: () => void;
}

export function DatePicker({ date, onChangeDate, onBlurDate }: iDatePicker) {
  const t = useTranslations("homePage");
  const locale = useLocale();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: locale === "es" ? es : enUS })
          ) : (
            <span>{t("selectDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode={"single"}
          selected={date}
          onSelect={onChangeDate}
          initialFocus
          onDayBlur={onBlurDate}
          locale={locale === "es" ? es : enUS}
        />
      </PopoverContent>
    </Popover>
  );
}
