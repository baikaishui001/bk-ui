import { setGlobalConfig, getComponentPrefix } from './_utils/global-config'
import type { BkUIOptions } from './_utils/global-config'
import type { App } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentType = any

export function installComponent(
  app: App,
  component: ComponentType,
  options?: BkUIOptions
) {
  const componentPrefix = getComponentPrefix(options)
  const registered = app.component(componentPrefix + component.name)
  if (!registered) {
    setGlobalConfig(app, options)
    app.component(componentPrefix + component.name, component)
  }
}
