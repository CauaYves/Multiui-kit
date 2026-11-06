"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Checkbox } from "@multiclubes/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@multiclubes/ui/components/field";
import { Input } from "@multiclubes/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import Image from "next/image";
import * as React from "react";
import { LogoWordmark } from "@/components/logo";

// Tela de criar conta de exemplo, o espelho do login-01. No desktop (lg+) é dividida: o
// formulário à esquerda e a imagem à direita, recortada pela mesma onda em S vertical,
// virada para o outro lado. Abaixo disso a imagem vira um topo com a onda espelhada na base
// e o formulário vem logo abaixo. A imagem é um placeholder e a marca fica em uma cor só
// (foreground), para o bloco servir a qualquer aplicação. O envio só valida os campos e
// simula a espera.

const MIN_PASSWORD = 8;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

/** Placeholder no claro; no escuro ele escurece e perde a cor, como nos blocos do shadcn. */
function Placeholder({ sizes }: { sizes: string }) {
  return (
    <Image
      src="/placeholder.svg"
      alt=""
      fill
      sizes={sizes}
      className="object-cover dark:brightness-[0.2] dark:grayscale"
    />
  );
}

export default function Signup01() {
  const clipId = React.useId();

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-background">
      <DesktopImage clipId={clipId} />
      <div className="relative z-10 flex min-h-svh flex-col lg:items-center lg:justify-center lg:py-10 lg:pr-[50%] lg:pl-6">
        <MobileImage />
        <div className="flex flex-1 flex-col gap-8 px-7 pt-2 pb-10 lg:w-full lg:max-w-105 lg:flex-none lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex flex-col gap-6">
            <LogoWordmark className="h-7 w-auto self-start text-foreground lg:h-8" />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
              <p className="text-sm text-muted-foreground">Preencha seus dados para começar.</p>
            </div>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

/** Metade direita do desktop: a imagem recortada pela onda, espelhada em relação ao login. */
function DesktopImage({ clipId }: { clipId: string }) {
  return (
    <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
      {/* SVG de tamanho zero só para definir o recorte. É a onda do login-01 espelhada
          (x → 1 − x): oscila entre 7% e 23% da largura do painel, avança no meio e volta
          embaixo. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M1,0 L0.15,0 C0.07,0.1 0.13,0.4 0.15,0.5 C0.17,0.6 0.23,0.9 0.15,1 L1,1 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-muted" style={{ clipPath: `url(#${clipId})` }}>
        <Placeholder sizes="52vw" />
      </div>
    </div>
  );
}

/**
 * Topo do celular: a imagem com a onda na base, já na cor do fundo do formulário. É a onda
 * do login-01 espelhada na horizontal (-scale-x-100). A camada translúcida atrás dá
 * profundidade e a da frente define o corte.
 */
function MobileImage() {
  return (
    <div className="relative h-[30svh] min-h-48 overflow-hidden bg-muted lg:hidden">
      <Placeholder sizes="100vw" />
      <svg
        viewBox="0 0 375 95"
        preserveAspectRatio="none"
        className="absolute -bottom-px left-0 z-10 block h-24 w-full -scale-x-100"
        aria-hidden="true"
      >
        <path d="M0,44 C195,-43 275,94 375,1 L375,95 L0,95 Z" className="fill-background/50" />
        <path d="M0,60 C195,-28 275,109 375,16 L375,95 L0,95 Z" className="fill-background" />
      </svg>
    </div>
  );
}

function SignUpForm() {
  const [errors, setErrors] = React.useState<Errors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const next: Errors = {
      name: data.get("name") ? undefined : "Informe seu nome",
      email: data.get("email") ? undefined : "Informe seu e-mail",
      password: !password
        ? "Crie uma senha"
        : password.length < MIN_PASSWORD
          ? `A senha precisa de pelo menos ${MIN_PASSWORD} caracteres`
          : undefined,
      confirm: !confirm
        ? "Confirme sua senha"
        : confirm !== password
          ? "As senhas não são iguais"
          : undefined,
      terms: acceptedTerms ? undefined : "Aceite os termos para continuar",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    // Exemplo: sem cadastro de verdade, só mostra o estado de espera.
    setPending(true);
    setTimeout(() => setPending(false), 1500);
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="signup-01-name">Nome completo</FieldLabel>
          <Input
            id="signup-01-name"
            name="name"
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.name)}
            // text-base no celular: abaixo de 16px o Safari do iOS dá zoom no foco.
            className="h-11 text-base lg:h-9 lg:text-sm"
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="signup-01-email">E-mail</FieldLabel>
          <Input
            id="signup-01-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            className="h-11 text-base lg:h-9 lg:text-sm"
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="signup-01-password">Senha</FieldLabel>
          <InputGroup className="h-11 lg:h-9">
            <InputGroupInput
              id="signup-01-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="signup-01-password-hint"
              className="text-base lg:text-sm"
            />
            <InputGroupAddon align="inline-end">
              {/* Um botão só mostra as duas senhas: quem confere a digitação quer ver ambas. */}
              <InputGroupButton
                size="icon-xs"
                aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : (
            <FieldDescription id="signup-01-password-hint">
              Use pelo menos {MIN_PASSWORD} caracteres.
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.confirm)}>
          <FieldLabel htmlFor="signup-01-confirm">Confirmar senha</FieldLabel>
          <Input
            id="signup-01-confirm"
            name="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm)}
            className="h-11 text-base lg:h-9 lg:text-sm"
          />
          {errors.confirm && <FieldError>{errors.confirm}</FieldError>}
        </Field>
        <Field orientation="horizontal" data-invalid={Boolean(errors.terms)}>
          <Checkbox
            id="signup-01-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked)}
            aria-invalid={Boolean(errors.terms)}
          />
          <div className="flex flex-col gap-1">
            {/* Links de exemplo: a aplicação troca por rotas de verdade. */}
            <FieldLabel htmlFor="signup-01-terms" className="font-normal">
              Li e aceito os termos de uso e a política de privacidade
            </FieldLabel>
            {errors.terms && <FieldError>{errors.terms}</FieldError>}
          </div>
        </Field>
        {/* Preto no claro e branco no escuro: a cor do texto, não a da marca. */}
        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-foreground text-base text-background hover:bg-foreground/90 lg:h-9 lg:text-sm"
        >
          {pending ? "Criando conta…" : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-normal text-foreground underline"
          >
            Entrar
          </Button>
        </p>
      </FieldGroup>
    </form>
  );
}
