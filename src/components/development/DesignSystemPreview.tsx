"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { CardGrid, Section } from "@/components/layout/Section";
import { ActionGroup, ActionLink, Button, TextLink } from "@/components/ui/Actions";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import typography from "@/styles/typography.module.css";
import styles from "./DesignSystemPreview.module.css";

// Laboratorio local: etiquetas de prueba, sin captación ni contenido de producción.
// La página solo lo incluye con NODE_ENV=development y flag explícito.
export function DesignSystemPreview() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Section id="ds-preview" aria-labelledby="ds-title" className={styles.preview}>
      <Container>
        <div className={styles.stack}>
          <div className={typography.titleText}>
            <h2 id="ds-title">Design System — muestra local de desarrollo</h2>
            <p>No es la Home final. Controles de prueba sin envío, persistencia ni medición.</p>
          </div>
          <div className={typography.titleText}>
            <h3>Typography</h3>
            <p className={typography.eyebrow}>Eyebrow · Medición y trazabilidad para generación de leads</p>
            <p className={typography.lead}>Lead · Conectamos campañas, CRM y resultados comerciales.</p>
            <p className={typography.body}>Body · Conectamos campañas, CRM y resultados comerciales.</p>
            <p className={typography.ui}>UI · Solicitar diagnóstico inicial</p>
            <p className={typography.caption}>Caption · Conectamos campañas, CRM y resultados comerciales.</p>
            <code className={typography.technical}>request_id</code>
          </div>
          <div className={typography.titleText}>
            <h3>Buttons y links</h3>
            <ActionGroup>
              <Button aria-pressed={disabled} onClick={() => setDisabled(!disabled)}>Alternar estado disabled del control de prueba</Button>
              <ActionLink href="#ds-fields" variant="secondary">Revisar controles de prueba</ActionLink>
              <Button disabled>Disabled · Solicitar diagnóstico inicial</Button>
            </ActionGroup>
            <p><TextLink href="#ds-title">Volver al título de la muestra</TextLink></p>
          </div>
          <div id="ds-fields" className={`${styles.controls} ${typography.titleText}`}>
            <h3>Form controls base — sin formulario</h3>
            <div>
              <Field id="ds-name" label="Nombre" autoComplete="off" disabled={disabled} help="Control de prueba; no se almacena ni envía." />
              <Field id="ds-email" label="Email de contacto" type="email" autoComplete="off" error="Indica un email válido para que podamos contactarte." />
              <Field id="ds-organization" label="Tipo de organización" kind="select" defaultValue="">
                <option value="">Selecciona una opción</option>
                <option value="lead_business">Empresa que capta leads</option>
                <option value="agency">Agencia</option>
                <option value="other">Otro</option>
              </Field>
              <Field id="ds-problem" label="¿Qué problema quieres resolver?" kind="textarea" help="En dos o tres frases, explica qué información te falta y qué necesitas poder medir." />
            </div>
          </div>
          <div className={typography.titleText}>
            <h3>Cards · grupo de tres</h3>
            <CardGrid>
              {[1, 2, 3].map((number) => (
                <Card key={number}>
                  <p className={typography.ui}>Tarjeta informativa de prueba {number}</p>
                  <p>Conectamos campañas, CRM y resultados comerciales.</p>
                </Card>
              ))}
            </CardGrid>
          </div>
          <div className={typography.titleText}>
            <h3>Cards · grupo de dos</h3>
            <CardGrid columns={2}>
              <Card><p>Conectamos campañas, CRM y resultados comerciales.</p></Card>
              <Card><p>Conectamos campañas, CRM y resultados comerciales.</p></Card>
            </CardGrid>
          </div>
        </div>
      </Container>
    </Section>
  );
}
