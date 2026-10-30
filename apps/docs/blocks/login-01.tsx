"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@multiclubes/ui/components/field";
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

// Tela de login de exemplo. No desktop (lg+) é dividida: uma imagem à esquerda, recortada
// por uma onda em S vertical, e o formulário à direita. Abaixo disso a imagem vira um
// topo com a onda na base e o formulário vem logo abaixo. A imagem é um placeholder e a
// marca fica em uma cor só (foreground), para o bloco servir a qualquer aplicação. O envio
// só valida os campos e simula a espera.

type Errors = { email?: string; password?: string };

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

export default function Login01() {
  const clipId = React.useId();

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-background">
      <DesktopImage clipId={clipId} />
      <div className="relative z-10 flex min-h-svh flex-col lg:items-center lg:justify-center lg:py-10 lg:pr-6 lg:pl-[50%]">
        <MobileImage />
        <div className="flex flex-1 flex-col gap-8 px-7 pt-2 pb-10 lg:w-full lg:max-w-105 lg:flex-none lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex flex-col gap-6">
            <LogoWordmark className="h-7 w-auto self-start text-foreground lg:h-8" />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
              <p className="text-sm text-muted-foreground">Entre com sua conta para continuar.</p>
            </div>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

/** Metade esquerda do desktop: a imagem recortada pela onda. */
function DesktopImage({ clipId }: { clipId: string }) {
  return (
    <div className="absolute inset-y-0 left-0 hidden w-[52%] lg:block">
      {/* SVG de tamanho zero só para definir o recorte. A onda oscila entre 77% e 93% da
          largura do painel: recua no meio e volta embaixo. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M0,0 L0.85,0 C0.93,0.1 0.87,0.4 0.85,0.5 C0.83,0.6 0.77,0.9 0.85,1 L0,1 Z" />
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
 * Topo do celular: a imagem com a onda na base, já na cor do fundo do formulário. A
 * camada translúcida atrás dá profundidade e a da frente define o corte.
 */
function MobileImage() {
  return (
    <div className="relative h-[38svh] min-h-56 overflow-hidden bg-muted lg:hidden">
      <Placeholder sizes="100vw" />
      <svg
        viewBox="0 0 375 95"
        preserveAspectRatio="none"
        className="absolute -bottom-px left-0 z-10 block h-24 w-full"
        aria-hidden="true"
      >
        <path d="M0,44 C195,-43 275,94 375,1 L375,95 L0,95 Z" className="fill-background/50" />
        <path d="M0,60 C195,-28 275,109 375,16 L375,95 L0,95 Z" className="fill-background" />
      </svg>
    </div>
  );
}

function SignInForm() {
  const [errors, setErrors] = React.useState<Errors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {
      email: data.get("email") ? undefined : "Informe seu e-mail",
      password: data.get("password") ? undefined : "Informe sua senha",
    };
    setErrors(next);
    if (next.email || next.password) return;

    // Exemplo: sem autenticação, só mostra o estado de espera.
    setPending(true);
    setTimeout(() => setPending(false), 1500);
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="login-01-email">E-mail</FieldLabel>
          <Input
            id="login-01-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            // text-base no celular: abaixo de 16px o Safari do iOS dá zoom no foco.
            className="h-11 text-base lg:h-9 lg:text-sm"
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field data-invalid={Boolean(errors.password)}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="login-01-password">Senha</FieldLabel>
            {/* Links de exemplo: a aplicação troca por rotas de verdade. */}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
            >
              Esqueceu a senha?
            </Button>
          </div>
          <InputGroup className="h-11 lg:h-9">
            <InputGroupInput
              id="login-01-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className="text-base lg:text-sm"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>
        {/* Preto no claro e branco no escuro: a cor do texto, não a da marca. */}
        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full bg-foreground text-base text-background hover:bg-foreground/90 lg:h-9 lg:text-sm"
        >
          {pending ? "Entrando…" : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-normal text-foreground underline"
          >
            Criar conta
          </Button>
        </p>
      </FieldGroup>
    </form>
  );
}
