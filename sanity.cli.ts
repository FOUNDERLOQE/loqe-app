import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'eiyy203r',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
