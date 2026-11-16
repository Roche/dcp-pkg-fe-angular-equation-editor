import { normalizeLocalizedOperators } from './useInputNormalizer';

describe('normalizeLocalizedOperators', () => {
    it('returns input unchanged when there are no aliases', () => {
        expect(normalizeLocalizedOperators('a und b', [])).toBe('a und b');
    });

    it('returns empty input unchanged', () => {
        expect(normalizeLocalizedOperators('', [{ label: 'und', value: 'and' }])).toBe('');
    });

    it('replaces localized operator labels with their values (case-insensitive)', () => {
        const aliases = [{ label: 'und', value: 'and' }];
        expect(normalizeLocalizedOperators('a UND b', aliases)).toBe('a and b');
    });

    it('does not replace labels that are part of a word', () => {
        const aliases = [{ label: 'or', value: '||' }];
        expect(normalizeLocalizedOperators('color or size', aliases)).toBe('color || size');
    });

    it('prefers longer labels over shorter overlapping ones', () => {
        const aliases = [
            { label: 'not', value: '!' },
            { label: 'not in', value: 'nin' },
        ];
        expect(normalizeLocalizedOperators('a not in b', aliases)).toBe('a nin b');
    });

    it('ignores aliases with empty label or value and keeps the first duplicate', () => {
        const aliases = [
            { label: ' ', value: 'x' },
            { label: 'y', value: '' },
            { label: 'oder', value: 'or' },
            { label: 'ODER', value: 'xor' },
        ];
        expect(normalizeLocalizedOperators('a oder b', aliases)).toBe('a or b');
    });
});
