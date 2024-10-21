import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ExtraFeaturePanel from './ExtraFeaturePanel'
import { Region, SessionWithWidgets, when } from '@jbrowse/core/util'

export default class ExtraPanelPlugin extends Plugin {
  name = 'ExtraPanel'

  install(pluginManager: PluginManager) {
    // add our "feature details extra panel customization"
    pluginManager.addToExtensionPoint(
      'Core-extraFeaturePanel',
      // @ts-expect-error
      (DefaultFeatureExtra, { model }: { model: { trackId: string } }) => {
        return model.trackId === 'volvox_filtered_vcf'
          ? { name: 'Extra info', Component: ExtraFeaturePanel }
          : DefaultFeatureExtra
      },
    )
  }

  configure(pluginManager: PluginManager) {
    // example adding some default bookmarks to the bookmark widget
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      await when(() => !!pluginManager.rootModel?.session)
      const session = pluginManager.rootModel?.session as SessionWithWidgets
      type RegionWithLabel = Region & { label: string }

      // @ts-expect-error
      const bookmarkWidget = (session.widgets.get('GridBookmark') ??
        session.addWidget('GridBookmarkWidget', 'GridBookmark')) as {
        addBookmark: (arg: RegionWithLabel) => void
        bookmarks: RegionWithLabel[]
      }

      // you could fetch these from an API
      if (!bookmarkWidget.bookmarks.some(b => b.label === 'IMPORTANTGENE3')) {
        bookmarkWidget.addBookmark({
          refName: 'ctgA',
          start: 0,
          end: 100,
          assemblyName: 'volvox',
          label: 'IMPORTANTGENE3',
        })
        bookmarkWidget.addBookmark({
          refName: 'ctgA',
          start: 400,
          end: 500,
          assemblyName: 'volvox',
          label: 'IMPORTANTGENE4',
        })
      }
      // optionally show the bookmark widget, comment out below to not always
      // show the bookmark widget
      session.showWidget(bookmarkWidget)
    })()
  }
}
