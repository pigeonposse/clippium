import { Clippium } from 'clippium'

import {
	Any,
	Prettify,
} from '../_shared/_super'

import type {
	ClippiumData,
	Parsed,
} from 'clippium'

export type AnyPlugin = Plugin<Any, Any, Any>
export type Plugins = Record<string, AnyPlugin>

export const createPlugin = <
	To extends ClippiumData['flags'],
	From extends ClippiumData['flags'],
	Docs extends ClippiumData['flags'],
>( plugin: Plugin<To, From, Docs> ): Plugin<To, From, Docs> => plugin

type ParsedFlags<F extends ClippiumData['flags']> = Pick<Parsed<{ flags: F }>, 'flags'>
type PluginUtils<F extends ClippiumData['flags']> = Prettify<Omit<Parameters<Clippium<ClippiumData>['fn']>[0], 'flags' | 'commands' | 'positionals'> & ParsedFlags<F>>

export type Plugin<
	To extends ClippiumData['flags'],
	From extends ClippiumData['flags'],
	Docs extends ClippiumData['flags'],
> = {
	/**
	 * Plugin description
	 */
	desc? : string
	/**
	 * Docs function for plugin
	 *
	 */
	docs?   : {
		/**
		 * Add custom flags for use in plugin command
		 */
		flags?    : Docs
		/**
		 * Add usage examples for the plugin command
		 */
		examples? : ClippiumData['examples']
		fn        : ( utils: PluginUtils<Docs> & { input: ClippiumData } ) => Promise<string>
	}
	/**
	 * Convert function for plugin
	 *
	 */
	convert?: {
		toData?   : {
			/**
			 * Add custom flags for use in plugin command
			 */
			flags?    : To
			/**
			 * Add usage examples for the plugin command
			 */
			examples? : ClippiumData['examples']
			fn        : ( utils: PluginUtils<To> & { input: string } ) => Promise<ClippiumData>
		}
		fromData? : {
			/**
			 * Add custom flags for use in plugin command
			 */
			flags?    : From
			/**
			 * Add usage examples for the plugin command
			 */
			examples? : ClippiumData['examples']
			fn        : ( utils: PluginUtils<From> & { input: ClippiumData } ) => Promise<string>
		}
	}
}
