import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, ButtonComponent, Setting, debounce } from 'obsidian';



export default class Reloader extends Plugin {

	async onload() {

		this.addCommand({
			id: `refresh`,
			name: `Refresh plugin list`,
			callback: async () => {
				await this.reloadPlugin(`plugin-reloader`);
			}
		})

		window.setTimeout(() => {
			// @ts-ignore
			const plugins = this.app.plugins.plugins;
			for (let name in plugins) {
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
		}, 1000 * 60)
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
