import { no, noop, identity } from '../shared/util';
import { LIFECYCLE_HOOKS } from '../shared/constants.js';

export default {
	optionMergeStrategies: Object.create(null),
	silent: false,
	productionTip: process.env.NODE_ENV !== 'production',
	errorHandler: null,
	warnHandler: null
};
