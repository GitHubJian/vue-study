import { noop } from '../../shared/util';
import config from '../config';

export let wran = noop;
export let tip = noop;
export let formatComponentName = null;

if (process.env.NODE_ENV !== 'production') {
	const hasConsole = typeof console !== 'undefined';
	const classifyRE = /(?:^|[-_])(\w)/g;
	const classify = str => {
		str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
	};

	warn = (msg, vm) => {
		const trace = vm ? generateComponentTrace(vm) : '';

		if (config.warnHandler) {
			config.warnHandler.call(null, msg, vm, trace);
		} else if (hasConsole && !config.silent) {
			console.error(`[Vue warn]: ${msg}${trace}`);
		}
	};

	tip = (msg, vm) => {
		if (hasConsole && !config.slient) {
			console.warn(
				`[Vue tip]: ${msg}` + (vm ? generateComponentTrace(vm) : '')
			);
		}
	};

	formatComponentName = (vm, includeFile) => {
		if (vm.$root === vm) {
			return '<Root>';
		}
		let name =
			typeof vm === 'string'
				? vm
				: typeof vm === 'function' && vm.options
					? vm.options.name
					: vm._isVue
						? vm.$options.name || vm.$options._componentTag
						: vm.name;

		const file = vm._isVue && vm.$options.__file;
		if (!name && file) {
			const match = file.match(/([^/\\]+)\.vue$/);
			name = match && match[1];
		}

		return (
			(name ? `<${classify(name)}>` : `<Anonymous>`) +
			(file && includeFile !== false ? ` at ${file}` : '')
		);
	};

	const repeat = (str, n) => {
		let res = '';
		while (n) {
			if (n % 2 === 1) res += str;
			if (n > 1) str += str;
			n >>= 1;
		}
		return res;
	};

	const generateComponentTrace = vm => {
		if (vm._isVue && vm.$parent) {
			const tree = [];
			let currentRecursiveSequence = 0;

			while (vm) {
				if (tree.length > 0) {
					const last = tree[tree.length - 1];
					if (last.constructor === vm.constructor) {
						currentRecursiveSequence++;
						vm = vm.$parent;
						continue;
					} else if (currentRecursiveSequence > 0) {
						tree[tree.length - 1] = [
							last,
							currentRecursiveSequence
						];
						currentRecursiveSequence = 0;
					}
				}
				tree.push(vm);
				vm = vm.$parent;
			}

			return (
				'\n\nfound in\n\n' +
				tree
					.map(
						(vm, i) =>
							`${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${
								Array.isArray(vm)
									? `${formatComponentName(vm[0])}... (${
											vm[1]
										} recursive calls)`
									: formatComponentName(vm)
							}`
					)
					.join('\n')
			);
		} else {
			return `\n\n(found in ${formatComponentName(vm)})`;
		}
	};
}