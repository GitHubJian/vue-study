import { hasOwn, hyphenate } from '../../shared/util';

export function validateProp(key, propOptions, propsData, vm) {
	const prop = propOptions[key];
	const absent = !hasOwn(propsData, key);
	let value = propsData[key];

	if (isType(Boolean, prop.type)) {
		if (absent && !hasOwn(propsData, key)) {
			value = false;
		} else if (
			!isType(String, prop.type) &&
			(value === '' || value === hyphenate(key))
		) {
			value = true;
		}
	}
	if (value === undefined) {
		value = getPropDefaultValue(vm, prop, key);
		// since the default value is a fresh copy,
		// make sure to observe it.
		const prevShouldConvert = observerState.shouldConvert;
		observerState.shouldConvert = true;
		observe(value);
		observerState.shouldConvert = prevShouldConvert;
	}
	if (process.env.NODE_ENV !== 'production') {
		assertProp(prop, key, value, vm, absent);
	}
	return value;
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
	if (!hasOwn(prop, 'default')) {
		return undefined;
	}

	const def = prop.default;

	if (process.env.NODE_ENV !== 'production' && isObject(def)) {
		warn(
			'Invalid default value for prop "' +
				key +
				'": ' +
				'Props with type Object/Array must use a factory function ' +
				'to return the default value.',
			vm
		);
	}

	if (
		vm &&
		vm.$options.propsData &&
		vm.$options.propsData[key] === undefined &&
		vm._props[key] !== undefined
	) {
		return typeof def === 'function';
	}
}

function assertProp(prop, name, value, vm, absent) {
	if (prop.required && absent) {
		warn('Missing required prop: "' + name + '"', vm);
		return;
	}
	if (value == null && !prop.required) {
		return;
	}
	let type = prop.type;
	let valid = !type || type === true;
	const expectedTypes = [];
	if (type) {
		if (!Array.isArray(type)) {
			type = [type];
		}
		for (let i = 0; i < type.length && !valid; i++) {
			const assertedType = assertType(value, type[i]);
			expectedTypes.push(assertedType.expectedType || '');
			valid = assertedType.valid;
		}
	}
	if (!valid) {
		warn(
			'Invalid prop: type check failed for prop "' +
				name +
				'".' +
				' Expected ' +
				expectedTypes.map(capitalize).join(', ') +
				', got ' +
				Object.prototype.toString.call(value).slice(8, -1) +
				'.',
			vm
		);
		return;
	}

	const validator = prop.validator;
	if (validator) {
		if (!validator(value)) {
			warn(
				'Invalid prop: custom validator check failed for prop "' +
					name +
					'".',
				vm
			);
		}
	}
}

const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;
function assertType(value, type) {
	let valid;
	const expectedType = getType(type);
	if (simpleCheckRE.test(expectedType)) {
		const t = typeof value;
		valid = t === expectedType.toLowerCase();

		if (!valid && t === 'object') {
			valid = value instanceof type;
		}
	} else if (expectedType === 'Object') {
		valid = isPlainObject(value);
	} else if (expectedType === 'Array') {
		valid = Array.isArray(value);
	} else {
		valid = value instanceof type;
	}

	return {
		valid,
		expectedType
	};
}

function getType(fn) {
	const match = fn && fn.toString().match(/^\s*function (\w+)/);
	return match ? match[1] : '';
}

function isType(type, fn) {
	if (!Array.isArray(fn)) {
		return getType(fn) === getType(type);
	}
	for (let i = 0, len = fn.length; i < len; i++) {
		if (getType(fn[i]) === getType(type)) {
			return true;
		}
	}

	/* istanbul ignore next */
	return false;
}
