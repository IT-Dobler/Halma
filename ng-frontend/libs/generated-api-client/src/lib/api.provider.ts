/*
 * Copyright (C) 2023 DV Bern AG, Switzerland
 *
 * Das vorliegende Dokument, einschliesslich aller seiner Teile, ist urheberrechtlich
 * geschuezt. Jede Verwertung ist ohne Zustimmung der DV Bern AG unzulaessig. Dies gilt
 * insbesondere für Vervielfaeltigungen, die Einspeicherung und Verarbeitung in
 * elektronischer Form. Wird das Dokument einem Kunden im Rahmen der Projektarbeit zur
 * Ansicht uebergeben, ist jede weitere Verteilung durch den Kunden an Dritte untersagt.
 */

import type {EnvironmentProviders} from '@angular/core';
import {makeEnvironmentProviders} from '@angular/core';

import {Configuration} from './generated';

export const REST_BACKEND = '';

export function withSimpleBackendApiConfiguration(): Configuration {
  return new Configuration({
    basePath: REST_BACKEND,
  });
}

export function provideApi(withConfiguration: () => Configuration = withSimpleBackendApiConfiguration): EnvironmentProviders {
  return makeEnvironmentProviders([
    {provide: Configuration, useFactory: withConfiguration},
  ]);
}
