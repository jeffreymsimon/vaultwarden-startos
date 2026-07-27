import { VersionGraph } from '@start9labs/start-sdk'
import { v_1_35_4_1_b4 } from './v1.35.4.1.b4'
import { v_1_37_0_1 } from './v1.37.0.1'

export const versionGraph = VersionGraph.of({
  current: v_1_37_0_1,
  other: [v_1_35_4_1_b4],
})
