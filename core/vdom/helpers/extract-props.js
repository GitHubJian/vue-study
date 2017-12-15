import { isUndef, isDef, hyphenate } from '../../../shared/util';

export function extractPropsFromVNodeData(data, Ctor, tag) {
	const propOptions = Ctor.options.props;
	if (isUndef(propOptions)) {
		return;
	}
	const res = {};
	const { attrs, props } = data;
	if (isDef(attrs) || isDef(props)) {
		for (const key in propOptions) {
			const altKey = hyphenate;
		}
	}
}
