"use client";

import { cn } from "cn";
import { format, getDaysInMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";

const DEFAULT_MIN_DATE = "1900-01-01";
const FALLBACK_MIN_PARTS: DateParts = { year: 1900, month: 0, day: 1 };
const DEFAULT_ORDER: DateWheelPart[] = ["day", "month", "year"];
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KEYBOARD_PAGE_STEP = 5;

// Detecta o fim da rolagem nos navegadores sem o evento `scrollend` (Safari e
// iOS antigos, o principal alvo deste componente).
const SCROLL_END_FALLBACK_DELAY = 120;

// Altura de uma linha da roda (44px), a área mínima de toque recomendada.
const ITEM_HEIGHT = "2.75rem";

const SPACER_CLASS_NAME =
  "h-[calc(var(--wheel-item-height)*((var(--wheel-visible-count)-1)/2))] shrink-0";

type DateWheelPart = "day" | "month" | "year";

type MonthFormat = "long" | "short" | "numeric";

interface DateParts {
  year: number;
  /** Começa em zero, como `Date#getMonth`. */
  month: number;
  day: number;
}

interface WheelOption {
  value: number;
  label: string;
}

/** "yyyy-MM-dd" como meia-noite local (`new Date("yyyy-MM-dd")` seria meia-noite UTC). */
function parseLocalDate(date: string) {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function toDateParts(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

function toISODate({ year, month, day }: DateParts) {
  // `format` preserva o dia do calendário local. `toISOString` recuaria um dia
  // em fusos negativos (UTC-3).
  return format(new Date(year, month, day), "yyyy-MM-dd");
}

function parseISODate(value: string | undefined): DateParts | null {
  if (!value || !ISO_DATE_PATTERN.test(value)) {
    return null;
  }

  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  const date = parseLocalDate(value);

  // Recusa datas que transbordam, como "2025-02-31", que o `parseLocalDate`
  // rolaria para o mês seguinte em silêncio.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return { year, month: month - 1, day };
}

function compareParts(left: DateParts, right: DateParts) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  if (left.month !== right.month) {
    return left.month - right.month;
  }

  return left.day - right.day;
}

/** Recua o `day` para o último dia do mês (31/01 -> 28 ou 29/02). */
function withValidDay(parts: DateParts): DateParts {
  const lastDay = getDaysInMonth(new Date(parts.year, parts.month));

  return { ...parts, day: Math.min(parts.day, lastDay) };
}

function clampParts(parts: DateParts, min: DateParts, max: DateParts): DateParts {
  if (compareParts(parts, min) < 0) {
    return min;
  }

  if (compareParts(parts, max) > 0) {
    return max;
  }

  return parts;
}

function buildYearOptions(min: DateParts, max: DateParts): WheelOption[] {
  const options: WheelOption[] = [];

  for (let year = min.year; year <= max.year; year++) {
    options.push({ value: year, label: String(year) });
  }

  return options;
}

function formatMonthLabel(month: number, monthFormat: MonthFormat) {
  if (monthFormat === "numeric") {
    return String(month + 1).padStart(2, "0");
  }

  // O ano de referência é irrelevante: só o nome do mês é lido.
  return format(new Date(2001, month, 1), monthFormat === "short" ? "MMM" : "MMMM", {
    locale: ptBR,
  });
}

function buildMonthOptions(
  year: number,
  min: DateParts,
  max: DateParts,
  monthFormat: MonthFormat,
): WheelOption[] {
  const firstMonth = year === min.year ? min.month : 0;
  const lastMonth = year === max.year ? max.month : 11;
  const options: WheelOption[] = [];

  for (let month = firstMonth; month <= lastMonth; month++) {
    options.push({ value: month, label: formatMonthLabel(month, monthFormat) });
  }

  return options;
}

function buildDayOptions(
  year: number,
  month: number,
  min: DateParts,
  max: DateParts,
): WheelOption[] {
  const isMinMonth = year === min.year && month === min.month;
  const isMaxMonth = year === max.year && month === max.month;

  const firstDay = isMinMonth ? min.day : 1;
  const lastDay = isMaxMonth ? max.day : getDaysInMonth(new Date(year, month));
  const options: WheelOption[] = [];

  for (let day = firstDay; day <= lastDay; day++) {
    options.push({ value: day, label: String(day) });
  }

  return options;
}

function findOptionIndex(options: WheelOption[], value: number) {
  return options.findIndex((option) => option.value === value);
}

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}

function readItemHeight(list: HTMLElement) {
  const option = list.querySelector<HTMLElement>("[data-slot='date-wheel-picker-option']");

  // `offsetHeight`, não `getBoundingClientRect().height`: as opções carregam
  // `scale-95` (e `scale-100` só quando selecionadas), e o rect devolve a
  // altura já transformada. Como o seletor pega a primeira opção — quase nunca
  // a selecionada —, a medida vinha 5% menor e o erro acumulava por índice:
  // no dia o negrito caía uma linha abaixo, no ano saía da tela.
  return option?.offsetHeight ?? 0;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getKeyboardIndex(key: string, currentIndex: number, lastIndex: number) {
  switch (key) {
    case "ArrowUp":
      return currentIndex - 1;
    case "ArrowDown":
      return currentIndex + 1;
    case "PageUp":
      return currentIndex - KEYBOARD_PAGE_STEP;
    case "PageDown":
      return currentIndex + KEYBOARD_PAGE_STEP;
    case "Home":
      return 0;
    case "End":
      return lastIndex;
    default:
      return null;
  }
}

interface DateWheelPickerColumnProps
  extends Omit<React.ComponentProps<"div">, "children" | "onKeyDown"> {
  options: WheelOption[];
  value: number;
  onOptionChange: (value: number) => void;
  label: string;
  optionClassName?: string;
  disabled?: boolean;
}

function DateWheelPickerColumn({
  className,
  options,
  value,
  onOptionChange,
  label,
  optionClassName,
  disabled,
  ...props
}: DateWheelPickerColumnProps) {
  const optionIdPrefix = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const hasPositionedRef = React.useRef(false);
  const scrollEndTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  // Impede que uma rolagem iniciada por nós volte como seleção do usuário, o
  // que entraria em laço com o valor do componente pai.
  const isSyncingRef = React.useRef(false);

  const [activeIndex, setActiveIndex] = React.useState(() =>
    clampIndex(findOptionIndex(options, value), options.length),
  );

  const scrollToIndex = React.useCallback((index: number, behavior: ScrollBehavior) => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const itemHeight = readItemHeight(list);

    if (!itemHeight) {
      return;
    }

    const target = index * itemHeight;

    // Já alinhado: rolar não emitiria evento, a marca de sincronização
    // ficaria presa e o próximo gesto seria engolido.
    if (Math.abs(list.scrollTop - target) < 1) {
      return;
    }

    isSyncingRef.current = true;
    list.scrollTo({ top: target, behavior });
  }, []);

  const positionToIndex = (node: HTMLDivElement, index: number) => {
    const itemHeight = readItemHeight(node);

    if (itemHeight <= 0) {
      return;
    }

    node.scrollTop = index * itemHeight;
    hasPositionedRef.current = true;
  };

  const attachList = (node: HTMLDivElement | null) => {
    listRef.current = node;

    if (!node || hasPositionedRef.current) {
      return;
    }

    // O callback de ref roda antes da primeira pintura, então a roda aparece
    // já posicionada. `useLayoutEffect` avisaria no servidor.
    const index = findOptionIndex(options, value);

    if (index >= 0) {
      positionToIndex(node, index);
    }
  };

  const readCenteredIndex = () => {
    const list = listRef.current;

    if (!list) {
      return null;
    }

    const itemHeight = readItemHeight(list);

    if (!itemHeight) {
      return null;
    }

    return clampIndex(Math.round(list.scrollTop / itemHeight), options.length);
  };

  const scrollHandlerRef = React.useRef<() => void>(() => undefined);
  const settleHandlerRef = React.useRef<() => void>(() => undefined);
  const positionHandlerRef = React.useRef<() => void>(() => undefined);

  // Atualizados a cada render para os ouvintes abaixo sempre verem as opções e
  // o valor atuais sem precisar ser reanexados — reanexar limparia o
  // temporizador pendente no meio de um gesto.
  React.useEffect(() => {
    scrollHandlerRef.current = () => {
      const index = readCenteredIndex();

      if (index !== null) {
        setActiveIndex(index);
      }

      clearTimeout(scrollEndTimeoutRef.current);
      scrollEndTimeoutRef.current = setTimeout(
        () => settleHandlerRef.current(),
        SCROLL_END_FALLBACK_DELAY,
      );
    };

    settleHandlerRef.current = () => {
      const index = readCenteredIndex();

      if (index === null) {
        return;
      }

      setActiveIndex(index);

      if (isSyncingRef.current) {
        isSyncingRef.current = false;
        return;
      }

      const option = options[index];

      if (option && option.value !== value) {
        onOptionChange(option.value);
      }
    };

    positionHandlerRef.current = () => {
      const list = listRef.current;
      const index = findOptionIndex(options, value);

      if (list && index >= 0) {
        positionToIndex(list, index);
      }
    };
  });

  React.useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const handleScroll = () => scrollHandlerRef.current();
    const handleScrollEnd = () => settleHandlerRef.current();

    list.addEventListener("scroll", handleScroll, { passive: true });
    list.addEventListener("scrollend", handleScrollEnd);

    // Montado dentro de um Drawer fechado (ou de um Activity oculto), o seletor
    // não tem altura e o posicionamento inicial acima não faz nada. Tenta de
    // novo assim que a coluna passa a ser medida.
    const observer = new ResizeObserver(() => {
      if (hasPositionedRef.current || list.clientHeight === 0) {
        return;
      }

      positionHandlerRef.current();
    });

    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", handleScroll);
      list.removeEventListener("scrollend", handleScrollEnd);
      observer.disconnect();
      clearTimeout(scrollEndTimeoutRef.current);
    };
  }, []);

  // Mantém a lista alinhada ao valor selecionado, cobrindo tanto atualizações
  // externas quanto os limites aplicados pelo pai (31/01 -> fevereiro).
  React.useEffect(() => {
    const index = findOptionIndex(options, value);

    if (index < 0) {
      return;
    }

    setActiveIndex(index);
    scrollToIndex(index, prefersReducedMotion() ? "auto" : "smooth");
  }, [options, value, scrollToIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    const nextIndex = getKeyboardIndex(event.key, activeIndex, options.length - 1);

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();

    const option = options[clampIndex(nextIndex, options.length)];

    if (option) {
      onOptionChange(option.value);
    }
  };

  return (
    <div
      ref={attachList}
      data-slot="date-wheel-picker-column"
      // Um <select> nativo não renderiza uma roda com scroll-snap, então o padrão
      // listbox/option é o equivalente em ARIA.
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${optionIdPrefix}-${activeIndex}`}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative h-full flex-1 snap-y snap-mandatory overflow-y-auto overscroll-y-contain rounded-lg outline-none",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        disabled && "pointer-events-none touch-none overflow-y-hidden",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className={SPACER_CLASS_NAME} />
      {options.map((option, index) => (
        <div
          key={option.value}
          id={`${optionIdPrefix}-${index}`}
          data-slot="date-wheel-picker-option"
          data-selected={index === activeIndex || undefined}
          // <option> só existe dentro de um <select> nativo, que não pode ser
          // estilizado como linha de roda.
          role="option"
          aria-selected={option.value === value}
          // Fora da ordem de tabulação de propósito: o foco é da coluna, que
          // aponta para cá por `aria-activedescendant`.
          tabIndex={-1}
          onClick={() => onOptionChange(option.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-(--wheel-item-height) shrink-0 snap-center cursor-default items-center justify-center px-2 text-base whitespace-nowrap tabular-nums opacity-60 transition-[color,opacity,transform]",
            "scale-95 text-muted-foreground",
            "data-selected:scale-100 data-selected:font-medium data-selected:text-foreground data-selected:opacity-100",
            optionClassName,
          )}
        >
          {option.label}
        </div>
      ))}
      <div aria-hidden="true" className={SPACER_CLASS_NAME} />
    </div>
  );
}

interface DateWheelPickerProps
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange"> {
  /** Data selecionada em "yyyy-MM-dd". Omita para uso não controlado. */
  value?: string;
  /** Data inicial no modo não controlado. Padrão: hoje, limitado à faixa. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Limite inferior em "yyyy-MM-dd". Padrão: "1900-01-01". */
  minDate?: string;
  /** Limite superior em "yyyy-MM-dd". Padrão: hoje, como no Calendar. */
  maxDate?: string;
  /** Linhas visíveis por coluna. Ímpar, para haver linha central. Padrão: 5. */
  visibleCount?: 3 | 5 | 7;
  /** Ordem das colunas. Padrão: a ordem de leitura pt-BR. */
  order?: DateWheelPart[];
  /** Estilo do rótulo do mês. Padrão: "long" (janeiro, fevereiro, ...). */
  monthFormat?: MonthFormat;
  disabled?: boolean;
  /** Mensagens de erro — mesma prop do InputProps, para casar com o FieldError. */
  errors?: string[];
}

function DateWheelPicker({
  className,
  style,
  value,
  defaultValue,
  onValueChange,
  minDate = DEFAULT_MIN_DATE,
  maxDate,
  visibleCount = 5,
  order = DEFAULT_ORDER,
  monthFormat = "long",
  disabled,
  errors,
  "aria-label": ariaLabel = "Seletor de data",
  ...props
}: DateWheelPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasError = Boolean(errors?.length);

  const min = React.useMemo(() => parseISODate(minDate) ?? FALLBACK_MIN_PARTS, [minDate]);
  const max = React.useMemo(() => parseISODate(maxDate) ?? toDateParts(new Date()), [maxDate]);

  // Valor ilegível ou fora da faixa apenas move as rodas; nunca é emitido,
  // então montar o seletor não suja um formulário por conta própria.
  const selected = React.useMemo(
    () => clampParts(parseISODate(currentValue) ?? toDateParts(new Date()), min, max),
    [currentValue, min, max],
  );

  const dayOptions = React.useMemo(
    () => buildDayOptions(selected.year, selected.month, min, max),
    [selected.year, selected.month, min, max],
  );
  const monthOptions = React.useMemo(
    () => buildMonthOptions(selected.year, min, max, monthFormat),
    [selected.year, min, max, monthFormat],
  );
  const yearOptions = React.useMemo(() => buildYearOptions(min, max), [min, max]);

  const commitParts = (parts: DateParts) => {
    const next = toISODate(clampParts(withValidDay(parts), min, max));

    if (!isControlled) {
      setUncontrolledValue(next);
    }

    if (next !== currentValue) {
      onValueChange?.(next);
    }
  };

  const columns: Record<DateWheelPart, DateWheelPickerColumnProps> = {
    day: {
      label: "Dia",
      options: dayOptions,
      value: selected.day,
      onOptionChange: (day) => commitParts({ ...selected, day }),
    },
    month: {
      label: "Mês",
      options: monthOptions,
      value: selected.month,
      // `capitalize` em vez de mexer na string: o date-fns devolve os nomes
      // de mês em pt-BR em minúsculas ("janeiro").
      optionClassName: "capitalize",
      onOptionChange: (month) => commitParts({ ...selected, month }),
    },
    year: {
      label: "Ano",
      options: yearOptions,
      value: selected.year,
      onOptionChange: (year) => commitParts({ ...selected, year }),
    },
  };

  return (
    <div
      data-slot="date-wheel-picker"
      // Um <fieldset> exigiria <legend> e traria as regras de dimensionamento do
      // navegador; isto é um widget composto, não uma seção de formulário.
      role="group"
      aria-label={ariaLabel}
      aria-invalid={hasError || undefined}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      // Dentro de um Drawer, arrastar a roda deve rolar as colunas, não fechar o drawer.
      data-base-ui-swipe-ignore=""
      style={
        {
          "--wheel-item-height": ITEM_HEIGHT,
          "--wheel-visible-count": String(visibleCount),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative h-[calc(var(--wheel-item-height)*var(--wheel-visible-count))] w-full select-none",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {/* Banda central que marca a linha selecionada. */}
      <div
        aria-hidden="true"
        data-slot="date-wheel-picker-indicator"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 h-(--wheel-item-height) -translate-y-1/2 rounded-lg bg-accent/50 ring-1 ring-border",
          hasError && "ring-destructive",
        )}
      />

      <div
        data-slot="date-wheel-picker-columns"
        className="relative flex h-full [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
      >
        {order.map((part) => (
          <DateWheelPickerColumn key={part} disabled={disabled} {...columns[part]} />
        ))}
      </div>

      {/* Anuncia o resultado da rolagem para leitores de tela. */}
      <output aria-live="polite" className="sr-only">
        {format(new Date(selected.year, selected.month, selected.day), "d 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })}
      </output>
    </div>
  );
}

export { DateWheelPicker, type DateWheelPickerProps };
