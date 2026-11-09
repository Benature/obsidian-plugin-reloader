import { App, Notice, Plugin, PluginManifest } from 'obsidian';

interface PluginManager {
	plugins: Record<string, { manifest: PluginManifest }>;
	disablePlugin(id: string): Promise<void>;
	enablePlugin(id: string): Promise<void>;
}

function getPluginManager(app: App): PluginManager {
	return (app as App & { plugins: PluginManager }).plugins;
}

export default class Reloader extends Plugin {

	onload(): void {

		this.addCommand({
			id: `refresh`,
			name: `Refresh plugin list`,
			callback: async () => {
				await this.reloadPlugin(`plugin-reloader`);
			}
		})

		window.setTimeout(() => {
			const plugins = getPluginManager(this.app).plugins;
			for (const name in plugins) {
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
		}, 1000)
	}

	onunload() { }

	async reloadPlugin(pluginName: string): Promise<void> {
		const plugins = getPluginManager(this.app);
		try {
			await plugins.disablePlugin(pluginName);
			await plugins.enablePlugin(pluginName);
		} catch (e) {
			console.error(e)
		}
	}
}
