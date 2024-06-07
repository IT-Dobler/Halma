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
