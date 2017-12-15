/*@flow  */

export function isUndef(v) {
	return v === undefined || v === null;
}

export function isDef(v) {
	return v !== undefined && v !== null;
}

export function isTrue(v) {
	return v === true;
}

export function isFalse(v) {
	return v === false;
}

export function isPrimitive(value) {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	);
}

export function isObject(obj) {
	return obj !== null && typeof obj === 'object';
}

const _toString = String.prototype.toString;

export function isPlainObject(obj) {
	return _toString.call(obj) === '[object Object]';
}

export function isRegExp(v) {
	return _toString.call(v) === '[object RegExp]';
}

export function isValidArrayIndex(val) {
	const n = parseFloat(val);
	return n >= 0 && Math.floor(n) === n && isFinite(val);
}

export function toString(val) {
	return val == null
		? ''
		: typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

export function toNumber(val) {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
}

export function makeMap(str, expectsLowerCase) {
	const map = Object.create(null);
	const list = str.split(',');
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

export function remove(arr, item) {
	if (arr.length) {
		const index = arr.indexOf(item);
		if (index > -1) {
			return arr.splice(index, 1);
		}
	}
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
	return hasOwnProperty.call(obj, key);
}

export function cached(fn) {
	const cache = Object.create(null);
	return function cachedFn(str) {
		const hit = cache[str];
		return hit || (cache[str] = fn(str));
	};
}

const camelizeRE = /-(\w)/g;
export const camelize = cached(str => {
	return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

export const capitalize = cached(str => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached(str => {
	return str.replace(hyphenateRE, '-$1').toLowerCase();
});

export function bind(fn, ctx) {
	function boundFn(a) {
		const l = arguments.length;
		return l
			? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)
			: fn.call(ctx);
	}

	boundFn._length = fn.length;
	return boundFn;
}

export function toArray(list, start) {
	start = start || 0;
	let i = list.length - start;
	const ret = new Array(i);

	while (i--) {
		ret[i] = list[i + start];
	}

	return ret;
}

export function extend(to, _from) {
	for (const key in _from) {
		to[key] = _from[key];
	}
	return to;
}

export function toObject(arr) {
	const res = {};
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) {
			extend(res, arr[i]);
		}
	}
	return res;
}

export function noop(a, b, c) {}

export const no = function(a, b, c) {
	return false;
};

export const indentity = function(_) {
	return _;
};

export function genStaticKeys(modules) {
	return modules
		.reduce((keys, m) => {
			return keys.concat(m.staticKeys || []);
		}, [])
		.join(',');
}

export function looseEqual(a, b) {
	if (a === b) return true;
	const isObjectA = isObject(a);
	const isObjectB = isObject(b);
	if (isObjectA && isObjectB) {
		try {
			const isArrayA = Array.isArray(a);
			const isArrayB = Array.isArray(b);
			if (isArrayA && isArrayB) {
				return (
					a.length === b.length &&
					a.every((e, i) => {
						return looseEqual(e, b[i]);
					})
				);
			} else if (!isArrayA && !isArrayB) {
				const keysA = Object.keys(a);
				const keysB = Object.keys(b);
				return (
					keysA.length === keysB.length &&
					keysA.every(key => {
						return looseEqual(a[key], b[key]);
					})
				);
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	} else if (!isObjectA && !isObjectB) {
		return String(a) === String(b);
	} else {
		return false;
	}
}

export function looseIndexOf(arr, val) {
	for (let i = 0; i < arr.length; i++) {
		if (looseEqual(arr[i], val)) return i;
	}
	return -1;
}

export function once(fn) {
	let called = false;
	return function() {
		if (!called) {
			called = true;
			fn.apply(this, arguments);
		}
	};
}
