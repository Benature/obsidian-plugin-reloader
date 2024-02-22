import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, ButtonComponent, Setting, debounce } from 'obsidian';



export default class MetadataIcon extends Plugin {

	async onload() {
		console.log("onload")
		// @ts-ignore
		const plugins = this.app.plugins.plugins;
		console.log(plugins)
		for (let name in plugins) {
			console.log(name)
			try {
				const m = plugins[name].manifest;
				this.addCommand({
					id: m.id,
					name: `Reload ${m.name}`,
					callback: async () => {
						new Notice(`Reload ${m.name}`);
						await this.reloadPlugin(m.id);
					}
				})
			} catch (e) {
				console.error(e)
			}
		}
	}

	onunload() { }

	async reloadPlugin(pluginName: string): Promise<void> {
		// @ts-ignore
		const { plugins } = this.app;
		try {
			await plugins.disablePlugin(pluginName);
			await plugins.enablePlugin(pluginName);
		} catch (e) {
			console.error(e)
		}
	}
}
