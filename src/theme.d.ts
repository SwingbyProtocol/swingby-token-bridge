import 'styled-components';
import { PulsarThemeType } from '@swingby-protocol/pulsar';

declare module 'styled-components' {
  export interface DefaultTheme extends PulsarThemeType {}
}
